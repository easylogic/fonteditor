/**
 * @file 解析cffdict数据
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var CFFTypes = require('./CFFTypes');
        var getCFFString = require('./getCFFString');
        var parseCFFIndex = require('./parseCFFIndex');
		var Reader = require('../../reader');

		var TOP_DICT_META = CFFTypes.TOP_DICT_META;
		var PRIVATE_DICT_META = CFFTypes.PRIVATE_DICT_META;

        function entriesToObject(entries) {
            var hash = {};

            for (var i = 0, l = entries.length; i < l; i++) {
                var key = entries[i][0];
                if (undefined !== hash[key]) {
                    console.warn('dict already has key:' + key);
                    continue;
                }

                var values = entries[i][1];
                hash[key] = values.length === 1 ? values[0] : values;
            }

            return hash;
        }


        /* eslint-disable no-constant-condition */
        function parseFloatOperand(reader) {
            var s = '';
            var eof = 15;
            var lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];

            while (true) {
                var b = reader.readUint8();
                var n1 = b >> 4;
                var n2 = b & 15;

                if (n1 === eof) {
                    break;
                }

                s += lookup[n1];

                if (n2 === eof) {
                    break;
                }

                s += lookup[n2];
            }

            return parseFloat(s);
        }
        /* eslint-enable no-constant-condition */

        /**
         * 解析cff字典数据
         * @param  {Reader} reader 读取器
         * @param  {number} b0     操作码
         * @return {number}        数据
         */
        function parseOperand(reader, b0) {
            var b1;
            var b2;
            var b3;
            var b4;
            if (b0 === 28) {
                b1 = reader.readUint8();
                b2 = reader.readUint8();
                return b1 << 8 | b2;
            }

            if (b0 === 29) {
                b1 = reader.readUint8();
                b2 = reader.readUint8();
                b3 = reader.readUint8();
                b4 = reader.readUint8();
                return b1 << 24 | b2 << 16 | b3 << 8 | b4;
            }

            if (b0 === 30) {
                return parseFloatOperand(reader);
            }

			
            if (b0 >= 32 && b0 <= 246) {
                return b0 - 139;
            }

            if (b0 >= 247 && b0 <= 250) {
                b1 = reader.readUint8();
                return (b0 - 247) * 256 + b1 + 108;
            }

            if (b0 >= 251 && b0 <= 254) {
                b1 = reader.readUint8();
                return -(b0 - 251) * 256 - b1 - 108;
            }

            throw new Error('invalid b0 ' + b0 + ',at:' + reader.offset);
        }
		

        /**
         * 解析字典值
         *
         * @param  {Object} dict    字典数据
         * @param  {Array} meta    元数据
         * @param  {Object} strings cff字符串字典
         * @return {Object}         解析后数据
         */
        function interpretDict(dict, meta, strings) {
            var newDict = {};
		    var value;

		    for (var i = 0, len = meta.length; i < len; i++) {
				var m = meta[i];

				if (Array.isArray(m.type)) {
					var values = [];
					values.length = m.type.length;
			
					for (var j = 0; j < m.type.length; j++) {
						value = dict[m.op] !== undefined ? dict[m.op][j] : undefined;
						if (value === undefined) {
							 value = m.value !== undefined && m.value[j] !== undefined ? m.value[j] : null;
						}
						if (m.type[j] === 'SID') {
							 value = getCFFString(strings, value);
						}
						values[j] = value;
					}

					newDict[m.name] = values;
				} else {
					value = dict[m.op];
					if (value === undefined) {
						value = m.value !== undefined ? m.value : null;
					}
			  
					if (m.type === 'SID') {
						value = getCFFString(strings, value);
					}
					newDict[m.name] = value;
				}

			}
            return newDict;
        }


        /**
         * 解析cff dict字典
         *
         * @param  {Reader} reader 读取器
         * @param  {number} offset  起始偏移
         * @param  {number} length   大小
         * @return {Object}        配置
         */
        function parseCFFDict(reader, offset, length) {
            if (null != offset) {
                reader.seek(offset);
            }

            var entries = [];
            var operands = [];
            var lastOffset = reader.offset + (null != length ? length : reader.length);

            while (reader.offset < lastOffset) {
                var op = reader.readUint8();		// 앞에 1바이트, 에서 b0 

                // The first byte for each dict item distinguishes between operator (key) and operand (value).
                // Values <= 21 are operators.
                if (op <= 21) {
                    // Two-byte operators have an initial escape byte of 12.
                    if (op === 12) {
                        op = 1200 + reader.readUint8();
                    }

                    entries.push([op, operands]);
                    operands = [];
                }
                else {
                    // Since the operands (values) come before the operators (keys), we store all operands in a list
                    // until we encounter an operator.
					// Operand 를 파싱하자. 
                    operands.push(parseOperand(reader, op));
                }
            }

            return entriesToObject(entries);
        }

		// Returns a list of "Top DICT"s found using an INDEX list.
		// Used to read both the usual high-level Top DICTs and also the FDArray
		// discovered inside CID-keyed fonts.  When a Top DICT has a reference to
		// a Private DICT that is read and saved into the Top DICT.
		//
		// In addition to the expected/optional values as outlined in TOP_DICT_META
		// the following values might be saved into the Top DICT.
		//
		//    _subrs []        array of local CFF subroutines from Private DICT
		//    _subrsBias       bias value computed from number of subroutines
		//                      (see calcCFFSubroutineBias() and parseCFFCharstring())
		//    _defaultWidthX   default widths for CFF characters
		//    _nominalWidthX   bias added to width embedded within glyph description
		//
		//    _privateDict     saved copy of parsed Private DICT from Top DICT
		function gatherCFFTopDicts(reader, start, cffIndex, strings, calcCFFSubroutineBias) {
			var topDictArray = [];
			for (var iTopDict = 0; iTopDict < cffIndex.length; iTopDict++) {
				var topDictData = new DataView(new Uint8Array(cffIndex[iTopDict]).buffer);
				var topDict = parseTopDict(new Reader(topDictData.buffer, 0, topDictData.byteLength, false), null, null, strings);
				topDict._subrs = [];
				topDict._subrsBias = 0;
				var privateSize = topDict.private[0];
				var privateOffset = topDict.private[1];
				if (privateSize !== 0 && privateOffset !== 0) {
					var privateDict = parsePrivateDict(reader, privateOffset + start, privateSize, strings);
					topDict._defaultWidthX = privateDict.defaultWidthX;
					topDict._nominalWidthX = privateDict.nominalWidthX;
					if (privateDict.subrs !== 0) {
						var subrOffset = privateOffset + privateDict.subrs;
						var subrIndex = parseCFFIndex(reader, subrOffset + start);
						topDict._subrs = subrIndex.objects;
						topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
					}
					topDict._privateDict = privateDict;
				}
				topDictArray.push(topDict);
			}
			return topDictArray;
		}

        /**
         * 解析cff top字典
         *
         * @param  {Reader} reader  读取器
         * @param  {number} start 开始offset
         * @param  {number} length 大小
         * @param  {Object} strings 字符串集合
         * @return {Object}         字典数据
         */
        function parseTopDict(reader, start, length, strings) {
            var dict = parseCFFDict(reader, start || 0, length || reader.length);
            return interpretDict(dict, TOP_DICT_META, strings);
        }

        /**
         * 解析cff私有字典
         *
         * @param  {Reader} reader  读取器
         * @param  {number} start 开始offset
         * @param  {number} length 大小
         * @param  {Object} strings 字符串集合
         * @return {Object}         字典数据
         */
        function parsePrivateDict(reader, start, length, strings) {
            var dict = parseCFFDict(reader, start || 0, length || reader.length);
            return interpretDict(dict, PRIVATE_DICT_META, strings);
        }


        return {
			TOP_DICT_META: TOP_DICT_META,
			PRIVATE_DICT_META: PRIVATE_DICT_META,
            parseTopDict: parseTopDict,
            parsePrivateDict: parsePrivateDict,
			gatherCFFTopDicts: gatherCFFTopDicts
        };
    }
);

