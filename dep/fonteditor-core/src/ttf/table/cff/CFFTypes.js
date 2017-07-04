/**
 * @file cff表
 */

define(
		

    function (require) {

		var encoding = require('./encoding');
				
		function hex (arr) {
			return arr.map(function(i) {
				return ('0' + i.toString(16)).substr(-2);
			}).join(' ').toUpperCase();
		}

		function check(isChecked, msg) {
			if (!isChecked)
			{
				new Error(msg);
			}
		}


		var encode = {

			'byte' : function (v) {
				check(0 <= v && v <= 255, 'Byte value should be between 0 and 255.');
				return [v];
			},

			'offsize': function (v) {
				return this['byte'](v);
			},

			'op' : function (v) {
				return this['byte'](v);
			},

			'card8': function (v) {
				return this['byte'](v);
			},

			'string' : function (v) {
				var len = v.length;

				var arr = [];
				for(var i = 0; i < len; i++) {
					arr[i] = v.charCodeAt(i);
				}

				return arr; 
			},

			'chararray' : function (v) {
				return this['string'](v);
			},

			'charstring' : function (ops) {
				// See encode.MACSTRING for why we don't do "if (wmm && wmm.has(ops))".
				var d = [];
				var length = ops.length;

				for (var i = 0; i < length; i += 1) {
					var op = ops[i];
					d = d.concat(this.convert(op.type, op.value));
				}

				return d;
			},

			'number' : function (v) { 

				if (-107 <= v && v <= 107) {
					return [v + 139]; 
				} else if (108 <= v && v <=  1131) {
					 v = v - 108;

					 return [(v >> 8) + 247, v & 0xFF];
				} else if (-1131 <= v && v <= -108) {
					 v = -v - 108;

					 return [(v >> 8) + 251, v & 0xFF];
				} else if (-32768 <= v && v <= 32767) {		// short, op 28 
					return this.number16(v);
				} else {									// int , op 29 
					return this.number32(v);
				}
			},

			'number16' : function (v) { 
				return [28, (v >> 8) & 0xff, v & 0xff];
			},
			
			'number32' : function (v) {
				return [29, (v >> 24) & 0xff,(v >> 16) & 0xff,(v >> 8) & 0xff, v & 0xff];
			},

			'tag' : function (v) {
				return this.string(v.substr(0, 4));
			},

			'uint16': function (v) {
				return [(v >> 8) & 0xff, v & 0xff];
			},

			'uint24': function (v) {
				return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
			},

			'ulong': function (v) {
				return [(v >> 24) & 0xff, (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
			},

			'ushort': function (v) {
				return this['uint16'](v);
			},

			'operator': function (v) {
				if (v < 1200) {
					return [v];
				} else {
					return [12, v - 1200];
				}
			},

			'operand' : function (v, type) {
				var d = [];
				if (Array.isArray(type)) {
					for (var i = 0; i < type.length; i += 1) {
						check(v.length === type.length, 'Not enough arguments given for type' + type);
						d = d.concat(this.operand(v[i], type[i]));
					}
				} else {
					if (type === 'SID') {
						d = d.concat(this.number(v));
					} else if (type === 'offset') {
						// We make it easy for ourselves and always encode offsets as
						// 4 bytes. This makes offset calculation for the top dict easier.
						d = d.concat(this.number32(v));
					} else if (type === 'number') {
						d = d.concat(this.number(v));
					} else if (type === 'real') {
						d = d.concat(this.real(v));
					} else {
						throw new Error('Unknown operand type ' + type);
						// FIXME Add support for booleans
					}
				}

				return d;
			},

			'dict' : function (v) {
				return v.encode();
			},

			'table' : function (v) {
				return v.encode();
			},

			'real' : function (v) {
				var value = v.toString();

				// Some numbers use an epsilon to encode the value. (e.g. JavaScript will store 0.0000001 as 1e-7)
				// This code converts it back to a number without the epsilon.
				var m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
				if (m) {
					var epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
					value = (Math.round(v * epsilon) / epsilon).toString();
				}

				var nibbles = '';
				var i;
				var ii;
				for (i = 0, ii = value.length; i < ii; i += 1) {
					var c = value[i];
					if (c === 'e') {
						nibbles += value[++i] === '-' ? 'c' : 'b';
					} else if (c === '.') {
						nibbles += 'a';
					} else if (c === '-') {
						nibbles += 'e';
					} else {
						nibbles += c;
					}
				}

				nibbles += (nibbles.length & 1) ? 'f' : 'ff';
				var out = [30];
				for (i = 0, ii = nibbles.length; i < ii; i += 2) {
					out.push(parseInt(nibbles.substr(i, 2), 16));
				}

				return out;
			},

			'sid' : function (v) {
				return this.number(v);
			},

			'offset' : function (v) {
				return this.number32(v);
			},

			convert : function (type, value) {

				if (Array.isArray(type))  // type  이 배열인경우 배열로 리턴	
				{
					var arr = [];
					for(var i = 0, len = type.length; i < len; i++) {
						arr = arr.concat(this.convert(type[i], value[i]));
					}
					return arr;
				} else {
					
					var encoder = this[(type || "").toLowerCase()]

					if (encoder)
					{
						var result  = encoder.call(this, value);
						return result; 
					} else {
						new Error("Invalid type: " + type);
					}	
				}
			}
		};

		var sizeof = {

			'byte' : function (v) {
				return 1; 
			},

			'op' : function (v) {
				return this['byte'](v);
			},

			'offsize': function (v) {
				return this['byte'](v);
			},

			'card8': function (v) {
				return this['byte'](v);
			},

			'string' : function (v) {
				return v.length; 
			},

			'chararray' : function (v) {
				return this['string'](v);
			},

			'charstring' : function (ops) {
				return encode.charstring(ops).length;
			},
			
			'number' : function (v) {
				if (-107 <= v && v <= 107) {
					return 1; 
				} else if (108 <= v && v <=  1131) {
					 return 2;
				} else if (-1131 <= v && v <= -108) {
					 return 2;
				} else if (-32768 <= v && v <= 32767) {		// short, op 28 
					return this.number16(v);
				} else {									// int , op 29 
					return this.number32(v);
				}
			},

			'number16' : function (v) {
				return 3; 
			},
			
			'number32' : function (v) {
				return 5;
			},

			'uint16' : function (v) {
				return 2; 
			},

			'uint24' : function (v) {
				return 3; 
			},

			'ulong' : function (v) {
				return 4; 
			},

			'ushort': function (v) {
				return this['uint16'](v);
			},

			'dict' : function (v) {
				return v.sizeof();
			},

			'table' : function (v) {
				return v.sizeof();
			},
			
			'real' : function (v) {
				return encode.real(v).length; 
			},

			'sid' : function (v) {
				return this.number(v);
			},
			
			'offset': function (v) {
				return this.number32(v);
			},

			'operator': function (v) {
				if (v < 1200) {
					return 1;
				} else {
					return 2;
				}
			},

			convert : function (type, value) {

				if (Array.isArray(type))  // type  이 배열인경우 배열로 리턴	
				{
					var total = 0;
					for(var i = 0, len = type.length; i < len; i++) {
						total += this.convert(type[i],value[i]);
					}

					return total; 
				} else {

					var encoder = this[(type || "").toLowerCase()]

					if (encoder)
					{
						return encoder.call(this, value);
					} else {
						new Error("Invalid type: " + type);
					}	
				}
			}
		};


		
        var TOP_DICT_META = [
            {
                name: 'version',
                op: 0,
                type: 'SID'
            },
            {
                name: 'notice',
                op: 1,
                type: 'SID'
            },
            {
                name: 'copyright',
                op: 1200,
                type: 'SID'
            },
            {
                name: 'fullName',
                op: 2,
                type: 'SID'
            },
            {
                name: 'familyName',
                op: 3,
                type: 'SID'
            },
            {
                name: 'weight',
                op: 4,
                type: 'SID'
            },
            {
                name: 'isFixedPitch',
                op: 1201,
                type: 'number',
                value: 0
            },
            {
                name: 'italicAngle',
                op: 1202,
                type: 'number',
                value: 0
            },
            {
                name: 'underlinePosition',
                op: 1203,
                type: 'number',
                value: -100
            },
            {
                name: 'underlineThickness',
                op: 1204,
                type: 'number',
                value: 50
            },
            {
                name: 'paintType',
                op: 1205,
                type: 'number',
                value: 0
            },
            {
                name: 'stringType',
                op: 1206,
                type: 'number',
                value: 2
            },
            {
                name: 'fontMatrix',
                op: 1207,
                type: ['real', 'real', 'real', 'real', 'real', 'real'],
                value: [0.001, 0, 0, 0.001, 0, 0]
            },
            {
                name: 'uniqueId',
                op: 13,
                type: 'number'
            },
            {
                name: 'fontBBox',
                op: 5,
                type: ['number', 'number', 'number', 'number'],
                value: [0, 0, 0, 0]
            },
            {
                name: 'strokeWidth',
                op: 1208,
                type: 'number',
                value: 0
            },
            {
                name: 'xuid',
                op: 14,
                type: [],
                value: null
            },
            {
                name: 'charset',
                op: 15,
                type: 'offset',
                value: 0
            },
            {
                name: 'encoding',
                op: 16,
                type: 'offset',
                value: 0
            },
            {
                name: 'strings',
                op: 17,
                type: 'offset',
                value: 0
            },
            {
                name: 'private',
                op: 18,
                type: ['number', 'offset'],
                value: [0, 0]
            },
			{
				name: 'ros', 
				op: 1230, 
				type: ['SID', 'SID', 'number']
			},
			{
				name: 'cidFontVersion', 
				op: 1231, 
				type: 'number', 
				value: 0
			},
			{
				name: 'cidFontRevision', 
				op: 1232, 
				type: 'number', 
				value: 0
			},
			{
				name: 'cidFontType', 
				op: 1233, 
				type: 'number', 
				value: 0
			},
			{
				name: 'cidCount', 
				op: 1234, 
				type: 'number', 
				value: 8720
			},
			{
				name: 'uidBase', 
				op: 1235, 
				type: 'number'
			},
			{
				name: 'fdArray', 
				op: 1236, 
				type: 'offset'
			},
			{
				name: 'fdSelect', 
				op: 1237, 
				type: 'offset'
			},
			{
				name: 'fontName', 
				op: 1238, 
				type: 'SID'
			}
        ];

        var PRIVATE_DICT_META = [
            {
                name: 'subrs',
                op: 19,
                type: 'offset',
                value: 0
            },
            {
                name: 'defaultWidthX',
                op: 20,
                type: 'number',
                value: 0
            },
            {
                name: 'nominalWidthX',
                op: 21,
                type: 'number',
                value: 0
            }
        ];

		
		function equals(a, b) {
			if (a === b) {
				return true;
			} else if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) {
					return false;
				}

				for (var i = 0; i < a.length; i += 1) {
					if (!equals(a[i], b[i])) {
						return false;
					}
				}

				return true;
			} else {
				return false;
			}
		}


		function makeDict (meta, attrs, strings) {
			 var m = {};
			for (var i = 0, len = meta.length; i < len; i++) {
				var entry = meta[i];

				var value = attrs[entry.name];
				if (value !== undefined && !equals(value, entry.value)) {
					if (entry.type === 'SID') {
						value = encoding.encodeString(value, strings);
					}
					m[entry.op] = {name: entry.name, type: entry.type, value: value};
				}
			}

			return m;
		}

		
		function makeCharsets(glyphNames, strings) {

			var m = [];

			m.push({ name : 'format', type : 'Card8', value : 0});

			for (var i = 0; i < glyphNames.length; i += 1) {
				var glyphName = glyphNames[i];
				var glyphSID = encoding.encodeString(glyphName, strings);
				m.push({name: 'glyph_' + i, type: 'SID', value: glyphSID});
			}

			return m;
		}
		
		function glyphToOps(glyph) {
			var ops = [];
			var path = glyph.path;
			ops.push({name: 'width', type: 'NUMBER', value: glyph.advanceWidth});
			var x = 0;
			var y = 0;
			for (var i = 0; i < path.commands.length; i += 1) {		// path command 에 따라서  바이트를 구성 
				var dx;
				var dy;
				var cmd = path.commands[i];
				if (cmd.type === 'Q') {
					// CFF only supports bézier curves, so convert the quad to a bézier.
					var _13 = 1 / 3;
					var _23 = 2 / 3;

					// We're going to create a new command so we don't change the original path.
					cmd = {
						type: 'C',
						x: cmd.x,
						y: cmd.y,
						x1: _13 * x + _23 * cmd.x1,
						y1: _13 * y + _23 * cmd.y1,
						x2: _13 * cmd.x + _23 * cmd.x1,
						y2: _13 * cmd.y + _23 * cmd.y1
					};
				}

				if (cmd.type === 'M') {
					dx = Math.round(cmd.x - x);
					dy = Math.round(cmd.y - y);
					ops.push({name: 'dx', type: 'NUMBER', value: dx});
					ops.push({name: 'dy', type: 'NUMBER', value: dy});
					ops.push({name: 'rmoveto', type: 'OP', value: 21});
					x = Math.round(cmd.x);
					y = Math.round(cmd.y);
				} else if (cmd.type === 'L') {
					dx = Math.round(cmd.x - x);
					dy = Math.round(cmd.y - y);
					ops.push({name: 'dx', type: 'NUMBER', value: dx});
					ops.push({name: 'dy', type: 'NUMBER', value: dy});
					ops.push({name: 'rlineto', type: 'OP', value: 5});
					x = Math.round(cmd.x);
					y = Math.round(cmd.y);
				} else if (cmd.type === 'C') {
					var dx1 = Math.round(cmd.x1 - x);
					var dy1 = Math.round(cmd.y1 - y);
					var dx2 = Math.round(cmd.x2 - cmd.x1);
					var dy2 = Math.round(cmd.y2 - cmd.y1);
					dx = Math.round(cmd.x - cmd.x2);
					dy = Math.round(cmd.y - cmd.y2);
					ops.push({name: 'dx1', type: 'NUMBER', value: dx1});
					ops.push({name: 'dy1', type: 'NUMBER', value: dy1});
					ops.push({name: 'dx2', type: 'NUMBER', value: dx2});
					ops.push({name: 'dy2', type: 'NUMBER', value: dy2});
					ops.push({name: 'dx', type: 'NUMBER', value: dx});
					ops.push({name: 'dy', type: 'NUMBER', value: dy});
					ops.push({name: 'rrcurveto', type: 'OP', value: 8});
					x = Math.round(cmd.x);
					y = Math.round(cmd.y);
				}

				// Contours are closed automatically.
			}

			ops.push({name: 'endchar', type: 'OP', value: 14});
			return ops;
		}

       
        return {
			encode : encode,
			sizeof : sizeof,
			makeDict : makeDict,
			makeCharsets : makeCharsets,
			glyphToOps: glyphToOps,
			TOP_DICT_META: TOP_DICT_META,
			PRIVATE_DICT_META: PRIVATE_DICT_META
		};
    }
);



