/**
 * @file cff表
 */

define(
		

    function (require) {

		var CFFTypes = require('./CFFTypes');

		function TABLE(fields) {
			this.fields = fields; 
			this.initBytes();
		}

		TABLE.prototype.initBytes = function () {
			this.bytes = []; 
		}

		TABLE.prototype.getBuffer = function () {
			return new Uint8Array(this.getBytes()).buffer; 
		}

		TABLE.prototype.getBytes = function () {
			return this.bytes; 
		}

		TABLE.prototype.put = function (arr) {
			this.bytes = this.bytes.concat(arr);
		}

		TABLE.prototype.encode = function (table) {
			this.initBytes();
	
			var d = [];
			var length = this.fields.length;
			var subtables = [];
			var subtableOffsets = [];
			var i;

			for (i = 0; i < length; i += 1) {
				var field = this.fields[i];
				var value = table ? table[field.name] : undefined;
				if (value === undefined) {
					value = field.value;
				}

				var bytes = this.getByte(field.type, value);

				if (field.type === 'table') {
					subtableOffsets.push(d.length);
					d = d.concat([0, 0]);
					subtables.push(bytes);
				} else {
					d = d.concat(bytes);
				}
			}

			for (i = 0; i < subtables.length; i += 1) {
				var o = subtableOffsets[i];
				var offset = d.length;
				check.argument(offset < 65536, 'Table ' + table.tableName + ' too big.');
				d[o] = offset >> 8;
				d[o + 1] = offset & 0xff;
				d = d.concat(subtables[i]);
			}

			return d;
		}

		TABLE.prototype.getByte = function (type, value) {
			return CFFTypes.encode.convert(type, value);
		}

		TABLE.prototype.getSize = function (type, value) {
			return CFFTypes.sizeof.convert(type, value);
		}

		TABLE.prototype.sizeof = function (table) {
			var numBytes = 0;
			var length = this.fields.length;

			for (var i = 0; i < length; i += 1) {
				var field = this.fields[i];
				var value = table ? table[field.name] : undefined;
				if (value === undefined) {
					value = field.value;
				}

				numBytes += this.getSize(field.type, value);

				// Subtables take 2 more bytes for offsets.
				if (field.type === 'table') {
					numBytes += 2;
				}
			}

			return numBytes;
		}

       
        return TABLE;
    }
);
