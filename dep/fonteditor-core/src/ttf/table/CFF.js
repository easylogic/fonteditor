/**
 * @file cff表
 * @author mengke01(kekee000@gmail.com)
 *
 * reference:
 * http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/font/pdfs/5176.CFF.pdf
 *
 * modify from:
 * https://github.com/nodebox/opentype.js/blob/master/src/tables/cff.js
 */

define(
    function (require) {

	    var lang = require('../../common/string');


        var table = require('./table');
        var string = require('../util/string');
        var encoding = require('./cff/encoding');
        var parseCFFDict = require('./cff/parseCFFDict');
        var parseCFFGlyph = require('./cff/parseCFFGlyph');
        var parseCFFCharset = require('./cff/parseCFFCharset');
        var parseCFFEncoding = require('./cff/parseCFFEncoding');
        var parseCFFFDSelect = require('./cff/parseCFFFDSelect');
        var parseCFFIndex = require('./cff/parseCFFIndex');

		// write 
		
		var makeHeader = require('./cff/makeHeader');
		var makeNameIndex = require('./cff/makeNameIndex');
		var makeTopDict = require('./cff/makeTopDict');
		var makeTopDictIndex = require('./cff/makeTopDictIndex');
		var makeGlobalSubrIndex = require('./cff/makeGlobalSubrIndex');
		var makeCharsets = require('./cff/makeCharsets');
		var makeCharStringsIndex = require('./cff/makeCharStringsIndex');
		var makePrivateDict = require('./cff/makePrivateDict');
		var makePrivateDictIndex = require('./cff/makePrivateDictIndex');
		var makeStringsIndex = require('./cff/makeStringsIndex');
		var makeFDSelect = require('./cff/makeFDSelect');
		var makeFontDict = require('./cff/makeFontDict');
		var makeFDArrayIndex = require('./cff/makeFDArrayIndex');
			

        var Reader = require('../reader');


        /**
         * 解析cff表头部
         * @param  {Reader} reader 读取器
         * @return {Object}        头部字段
         */
        function parseCFFHead(reader) {
            var head = {};
            head.startOffset = reader.offset;
            head.endOffset = head.startOffset + 4;
            head.formatMajor = reader.readUint8();
            head.formatMinor = reader.readUint8();
            head.size = reader.readUint8();
            head.offsetSize = reader.readUint8();

            return head;
        }

        
        // Subroutines are encoded using the negative half of the number space.
        // See type 2 chapter 4.7 "Subroutine operators".
        function calcCFFSubroutineBias(subrs) {
            var bias;
            if (subrs.length < 1240) {
                bias = 107;
            }
            else if (subrs.length < 33900) {
                bias = 1131;
            }
            else {
                bias = 32768;
            }

            return bias;
        }


        var cff = table.create(
            'CFF',
            [],
            {
                read: function (reader, font) {
                    var offset = this.offset;
                    reader.seek(offset);

                    var head = parseCFFHead(reader);
                    var nameIndex = parseCFFIndex(reader, head.endOffset, string.getString);
                    var topDictIndex = parseCFFIndex(reader, nameIndex.endOffset);
                    var stringIndex = parseCFFIndex(reader, topDictIndex.endOffset, string.getString);

                    var globalSubrIndex = parseCFFIndex(reader, stringIndex.endOffset);
                    var cff = {
                        head: head
                    };

                    // 全局子glyf数据
                    cff.gsubrs = globalSubrIndex.objects;
                    cff.gsubrsBias = calcCFFSubroutineBias(globalSubrIndex.objects);

					var topDictArray = parseCFFDict.gatherCFFTopDicts(reader, offset, topDictIndex.objects, stringIndex.objects, calcCFFSubroutineBias);
					  if (topDictArray.length !== 1) {
						  throw new Error('CFF table has too many fonts in \'FontSet\' - ' + 'count of fonts NameIndex.length = ' + topDictArray.length);
					  }
				  
					 var topDict = topDictArray[0];

                    // 顶级字典数据
					/*
                    var dictReader = new Reader(new Uint8Array(topDictIndex.objects[0]).buffer);
                    var topDict = parseCFFDict.parseTopDict(
                        dictReader,
                        0,
                        dictReader.length,
                        stringIndex.objects
                    );
					*/
                    cff.topDict = topDict;

					if (topDict._privateDict) {
						 cff.defaultWidthX = topDict._privateDict.defaultWidthX;
						 cff.nominalWidthX = topDict._privateDict.nominalWidthX;
					 }
				 
					 if (topDict.ros[0] !== undefined && topDict.ros[1] !== undefined) {
						 cff.isCIDFont = true;
					 }
				 
					 if (cff.isCIDFont) {

						 var fdArrayOffset = topDict.fdArray;
						 var fdSelectOffset = topDict.fdSelect;		// offset  도 설정 해야함 . 

						 if (fdArrayOffset === 0 || fdSelectOffset === 0) {
							 throw new Error('Font is marked as a CID font, but FDArray and/or FDSelect information is missing');
						 }
						 fdArrayOffset += offset;
						 // fdarray index  를 가지고 온다. 
						 var fdArrayIndex = parseCFFIndex(reader, fdArrayOffset);

						 // fdindex  를 기준으로  dict  을 생성하고 
						 var fdArray = parseCFFDict.gatherCFFTopDicts(reader, offset, fdArrayIndex.objects, stringIndex.objects, calcCFFSubroutineBias);
						 topDict._fdArray = fdArray;
						 fdSelectOffset += offset;
				
						 //  fdselect  를 가지고 온다. 
						 topDict._fdSelect = parseCFFFDSelect(reader, fdSelectOffset, cff, fdArray.length);
					 }


				 

                    // 私有字典数据
                    var privateDictLength = topDict.private[0];
                    var privateDict = {};

                    if (privateDictLength) {
                        var privateDictOffset = offset + topDict.private[1];
                        privateDict = parseCFFDict.parsePrivateDict(
                            reader,
                            privateDictOffset,
                            privateDictLength,
                            stringIndex.objects
                        );
                        cff.defaultWidthX = privateDict.defaultWidthX;
                        cff.nominalWidthX = privateDict.nominalWidthX;
                    }
                    else {
                        cff.defaultWidthX = 0;
                        cff.nominalWidthX = 0;
                    }

                    // 私有子glyf数据
                    if (privateDict.subrs) {

                        var subrOffset = privateDictOffset + privateDict.subrs;
                        var subrIndex = parseCFFIndex(reader, subrOffset);
                        cff.subrs = subrIndex.objects;
                        cff.subrsBias = calcCFFSubroutineBias(cff.subrs);
                    }
                    else {
                        cff.subrs = [];
                        cff.subrsBias = 0;
                    }
                    cff.privateDict = privateDict;

                    // 解析glyf数据和名字
                    var charStringsIndex = parseCFFIndex(reader, offset + topDict.strings);
                    var nGlyphs = charStringsIndex.objects.length;
                    cff.charset = parseCFFCharset(reader, offset + topDict.charset, nGlyphs, stringIndex.objects);

                    // Standard encoding
                    if (topDict.encoding === 0) {
                        cff.encoding = encoding.standardEncoding;
                    }
                    // Expert encoding
                    else if (topDict.encoding === 1) {
                        cff.encoding = encoding.expertEncoding;
                    }
                    else {
                        cff.encoding = parseCFFEncoding(reader, offset + topDict.encoding);
                    }

                    cff.glyf = [];

                    // only parse subset glyphs
                    var subset = font.readOptions.subset;
                    if (subset && subset.length > 0) {

                        // subset map
                        var subsetMap = {
                            0: true // 设置.notdef
                        };
                        var codes = font.cmap;

                        // unicode to index
                        Object.keys(codes).forEach(function (c) {
                            if (subset.indexOf(+c) > -1) {
                                var i = codes[c];
                                subsetMap[i] = true;
                            }
                        });
                        font.subsetMap = subsetMap;

                        Object.keys(subsetMap).forEach(function (i) {
                            i = +i;
                            var glyf = parseCFFGlyph(charStringsIndex.objects[i], cff, i);
							glyf.name = cff.charset[i];

                            cff.glyf[i] = glyf;
                        });
                    }
                    // parse all
                    else {
                        for (var i = 0, l = nGlyphs; i < l; i++) {
                            var glyf = parseCFFGlyph(charStringsIndex.objects[i], cff, i);

  						    glyf.name = cff.charset[i];

                            cff.glyf.push(glyf);
                        }
                    }

                    return cff;
                },

				writeCIDFont : function (writer, font) {
				
					var CFF = font.CFF;
					var fontScale = 1 / font.unitsPerEm;

					var attrs = lang.extend({
						fontBBox: [0, 0, 0, 0],
						fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
						charset: 999,
						encoding: 0,
						strings: 999,
						private: [0, 999]
					}, CFF.topDict);

					var privateAttrs = {};

					var glyphs = CFF.glyf;
					var glyphNames = [];
					var glyph;

					// Skip first glyph (.notdef)
					for (var i = 1; i < glyphs.length; i += 1) {
						glyph = glyphs[i];
						glyphNames.push(glyph.name);
					}

					var strings = [];

					// make header 
					var header = makeHeader(CFF);

					// nameIndex 
					var nameIndex = makeNameIndex([font.name.postScriptName]);
					//topDict
					var topDict = makeTopDict(attrs, strings);

					// topDictIndex
					// 전체적인 기본 정보를 입력한다. 
					// 그리고 몇가지  offset  정보도 같이 포함한다. 
					// 예를 들어  cid font  에 관련된  fdarray, fdselect  정보의  offset 도 가지고 있다. 
					var topDictIndex = makeTopDictIndex(topDict);

					// globalSubrIndex
					var globalSubrIndex = makeGlobalSubrIndex();

					// charsets 
					// 어떠한 글자 셋을 가지고 있는지 체크한다. 
					var charsets = makeCharsets(glyphNames, strings);

					// charStringsIndex
					// 글자 정보들은 여기에 모두 집결 
					var charStringsIndex = makeCharStringsIndex(glyphs);

					// privateDict
					var privateDict = makePrivateDict(privateAttrs, strings);

					var privateDictIndex = makePrivateDictIndex(privateDict);

					// 모아진 string  을 가지고  index  객체로 만든다. 
					var stringIndex = makeStringsIndex(strings);

					// cid font  의 경우   FontDict  을 만들어야한다. 
					//  fontDict  은  topDict._fdArray  에 있는 데이타로 만들어보자. 
					var fontDict = makeFontDict(topDict._fdArray, strings);
					//  fontDict 은 다시  FDArrayIndex  로 만들어진다. 
					var fdArrayIndex = makeFDArrayIndex(fontDict);
					// 그걸 기반으로  topDict._fdselect  를 만들어서 저장한다. 
					var fdselect = makeFDSelect(topDict._fdSelect);

					var startOffset = header.sizeof() +
						nameIndex.sizeof() +
						topDictIndex.sizeof() +
						stringIndex.sizeof() +
						globalSubrIndex.sizeof();

					attrs.charset = startOffset;

					// We use the CFF standard encoding; proper encoding will be handled in cmap.
					attrs.encoding = 0;
					attrs.strings = attrs.charset + charsets.sizeof();
					attrs.private[1] = attrs.strings + charStringsIndex.sizeof();

					//cid  폰트 관련된 속성을 재생성한다. 
					attrs.fdArray = attrs.charset + fontDictIndex.sizeof();  //  여긴 오프셋만 넣어보자. 
					attrs.fdSelect = attrs.fdArray + fdSelect.sizeof();
					attrs.private[1] = attrs.fdSelect + charStringsIndex.sizeof();

					// Recreate the Top DICT INDEX with the correct offsets.
					topDict = makeTopDict(attrs, strings);
					topDictIndex = makeTopDictIndex(topDict);

					// writer 
					writer.writeBytes(header.encode());
					writer.writeBytes(nameIndex.encode());
					writer.writeBytes(topDictIndex.encode());
					writer.writeBytes(stringIndex.encode());
					writer.writeBytes(globalSubrIndex.encode());
					writer.writeBytes(charsets.encode());
					writer.writeBytes(fdselect.encode());
					writer.writeBytes(charStringsIndex.encode());
					writer.writeBytes(fontDictIndex.encode());
					writer.writeBytes(privateDictIndex.encode());

					return writer;

                    //throw new Error('not support write cff table');
				},

				writeOTFFont : function (writer, font) {
					
					var CFF = font.CFF; 
					var fontScale = 1 / font.unitsPerEm;


					var attrs = lang.extend({
						fontBBox: [0, 0, 0, 0],
						fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
						charset: 999,
						encoding: 0,
						strings: 999,
						private: [0, 999]
					}, CFF.topDict);

					var privateAttrs = {};

					var glyphs = CFF.glyf;
					var glyphNames = [];
					var glyph;

					// Skip first glyph (.notdef)
					for (var i = 1; i < glyphs.length; i += 1) {
						glyph = glyphs[i];
						glyphNames.push(glyph.name);
					}

					var strings = [];

					// make header 
					var header = makeHeader(CFF);

					// nameIndex 
					var nameIndex = makeNameIndex([font.name.postScriptName]);
					//topDict
					var topDict = makeTopDict(attrs, strings);

					// topDictIndex
					// 전체적인 기본 정보를 입력한다. 
					// 그리고 몇가지  offset  정보도 같이 포함한다. 
					// 예를 들어  cid font  에 관련된  fdarray, fdselect  정보의  offset 도 가지고 있다. 
					var topDictIndex = makeTopDictIndex(topDict);

					// globalSubrIndex
					var globalSubrIndex = makeGlobalSubrIndex();

					// charsets 
					// 어떠한 글자 셋을 가지고 있는지 체크한다. 
					var charsets = makeCharsets(glyphNames, strings);

					// charStringsIndex
					// 글자 정보들은 여기에 모두 집결 
					var charStringsIndex = makeCharStringsIndex(glyphs);

					// privateDict
					var privateDict = makePrivateDict(privateAttrs, strings);

					var privateDictIndex = makePrivateDictIndex(privateDict);

					// 모아진 string  을 가지고  index  객체로 만든다. 
					var stringIndex = makeStringsIndex(strings);

					var startOffset = header.sizeof() +
						nameIndex.sizeof() +
						topDictIndex.sizeof() +
						stringIndex.sizeof() +
						globalSubrIndex.sizeof();

					attrs.charset = startOffset;

					// We use the CFF standard encoding; proper encoding will be handled in cmap.
					attrs.encoding = 0;
					attrs.strings = attrs.charset + charsets.sizeof();
					attrs.private[1] = attrs.strings + charStringsIndex.sizeof();

					// Recreate the Top DICT INDEX with the correct offsets.
					topDict = makeTopDict(attrs, strings);
					topDictIndex = makeTopDictIndex(topDict);

					// writer 
					writer.writeBytes(header.encode());
					writer.writeBytes(nameIndex.encode());
					writer.writeBytes(topDictIndex.encode());
					writer.writeBytes(stringIndex.encode());
					writer.writeBytes(globalSubrIndex.encode());
					writer.writeBytes(charsets.encode());
					writer.writeBytes(charStringsIndex.encode());
					writer.writeBytes(privateDictIndex.encode());

					return writer;
				},

                write: function (writer, font) {
					
					return this.writeOTFFont(writer, font);

					/*
					var isCIDFont = false; 
					var CFF = font.CFF;

					if (CFF.topDict.ros[0] !== undefined && CFF.topDict.ros[1] !== undefined) {
						 isCIDFont = true;
					}

					if (isCIDFont)
					{
						return this.writeCIDFont(writer, font);
					} else {
						return this.writeOTFFont(writer, font);
					}
					*/
                },

				sizeCIDFont: function (font) {
					var CFF = font.CFF;
					var fontScale = 1 / font.unitsPerEm;

					// topDict 설정하기 전에 기본 설정 정리 

					var attrs = lang.extend({
						fontBBox: [0, 0, 0, 0],
						fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
						charset: 999,
						encoding: 0,
						strings: 999,
						private: [0, 999]
					}, CFF.topDict);

					var privateAttrs = {};

					var glyphs = CFF.glyf;
					var glyphNames = [];
					var glyph;

					// Skip first glyph (.notdef)
					for (var i = 1; i < glyphs.length; i += 1) {
						glyph = glyphs[i];
						glyphNames.push(glyph.name);
					}

					var strings = [];

					// make header 
					var header = makeHeader(CFF);

					// nameIndex 
					var nameIndex = makeNameIndex([font.name.postScriptName]);
					//topDict
					var topDict = makeTopDict(attrs, strings);

					// topDictIndex
					var topDictIndex = makeTopDictIndex(topDict);

					// globalSubrIndex
					var globalSubrIndex = makeGlobalSubrIndex();

					// charsets 
					var charsets = makeCharsets(glyphNames, strings);

					// charStringsIndex
					var charStringsIndex = makeCharStringsIndex(glyphs);

					// privateDict
					var privateDict = makePrivateDict(privateAttrs, strings);

					var privateDictIndex = makePrivateDictIndex(privateDict);

					var stringIndex = makeStringsIndex(strings);

					var fdselect = makeFDSelect(topDict);
					var fontDictIndex = makeFontDictIndex();

					var startOffset = header.sizeof() +
						nameIndex.sizeof() +
						topDictIndex.sizeof() +
						stringIndex.sizeof() +
						globalSubrIndex.sizeof();

					attrs.charset = startOffset;

					// We use the CFF standard encoding; proper encoding will be handled in cmap.
					attrs.encoding = 0;
					attrs.strings = attrs.charset + charsets.sizeof();
					attrs.private[1] = attrs.strings + charStringsIndex.sizeof();
 
					attrs.fdArray = 0;
					attrs.fdSelect = 0;

					// Recreate the Top DICT INDEX with the correct offsets.
					topDict = makeTopDict(attrs, strings);
					topDictIndex = makeTopDictIndex(topDict);

					// writer 
					var totalSize = 0;

					totalSize += header.sizeof();
					totalSize += nameIndex.sizeof();
					totalSize += topDictIndex.sizeof();
					totalSize += stringIndex.sizeof();
					totalSize += globalSubrIndex.sizeof();
					totalSize += charsets.sizeof();
					totalSize += fdselect.sizeof();
					totalSize += charStringsIndex.sizeof();
					totalSize += fontDictIndex.sizeof();
					totalSize += privateDictIndex.sizeof();

					return totalSize; 
				},

				sizeOTFFont: function (font) {
					var CFF = font.CFF;
					var fontScale = 1 / font.unitsPerEm;

					var attrs = lang.extend({
						fontBBox: [0, 0, 0, 0],
						fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
						charset: 999,
						encoding: 0,
						strings: 999,
						private: [0, 999]
					}, CFF.topDict);

					var privateAttrs = {};

					var glyphs = CFF.glyf;
					var glyphNames = [];
					var glyph;

					// Skip first glyph (.notdef)
					for (var i = 1; i < glyphs.length; i += 1) {
						glyph = glyphs[i];
						glyphNames.push(glyph.name);
					}

					var strings = [];

					// make header 
					var header = makeHeader(CFF);

					// nameIndex 
					var nameIndex = makeNameIndex([font.name.postScriptName]);
					//topDict
					var topDict = makeTopDict(attrs, strings);

					// topDictIndex
					var topDictIndex = makeTopDictIndex(topDict);

					// globalSubrIndex
					var globalSubrIndex = makeGlobalSubrIndex();

					// charsets 
					var charsets = makeCharsets(glyphNames, strings);

					// charStringsIndex
					var charStringsIndex = makeCharStringsIndex(glyphs);

					// privateDict
					var privateDict = makePrivateDict(privateAttrs, strings);

					var privateDictIndex = makePrivateDictIndex(privateDict);

					var stringIndex = makeStringsIndex(strings);

					var startOffset = header.sizeof() +
						nameIndex.sizeof() +
						topDictIndex.sizeof() +
						stringIndex.sizeof() +
						globalSubrIndex.sizeof();

					attrs.charset = startOffset;

					// We use the CFF standard encoding; proper encoding will be handled in cmap.
					attrs.encoding = 0;
					attrs.strings = attrs.charset + charsets.sizeof();
					attrs.private[1] = attrs.strings + charStringsIndex.sizeof();

					// Recreate the Top DICT INDEX with the correct offsets.
					topDict = makeTopDict(attrs, strings);
					topDictIndex = makeTopDictIndex(topDict);

					// writer 
					var totalSize = 0;

					totalSize += header.sizeof();
					totalSize += nameIndex.sizeof();
					totalSize += topDictIndex.sizeof();
					totalSize += stringIndex.sizeof();
					totalSize += globalSubrIndex.sizeof();
					totalSize += charsets.sizeof();
					totalSize += charStringsIndex.sizeof();
					totalSize += privateDictIndex.sizeof();
                    //throw new Error('not support get cff table size');

					return totalSize; 
				},

                size: function (font) {
					return this.sizeOTFFont(writer, font);

					/*
					var isCIDFont = false; 
					var CFF = font.CFF;

					if (CFF.topDict.ros[0] !== undefined && CFF.topDict.ros[1] !== undefined) {
						 isCIDFont = true;
					}

					if (isCIDFont)
					{
						return this.sizeCIDFont(writer, font);
					} else {
						return this.sizeOTFFont(writer, font);
					}
					*/
				
                }
            }
        );

        return cff;
    }
);
