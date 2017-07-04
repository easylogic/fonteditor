/**
 * @file cff表
 */

define(
		

    function (require) {

		var CFFTypes = require('./CFFTypes');

		function INDEX(arr) {
			this.objects = arr; 
			this.initBytes();
		}

		INDEX.prototype.initBytes = function () {
			this.bytes = []; 
		}

		INDEX.prototype.getBuffer = function () {
			return new Uint8Array(this.getBytes()).buffer; 
		}

		INDEX.prototype.getBytes = function () {
			return this.bytes; 
		}

		INDEX.prototype.put = function (arr) {
			this.bytes = this.bytes.concat(arr);
		}

		INDEX.prototype.calcOffsetSize = function (maxOffset) {
	
			if (!maxOffset)
			{
				return 0;
			}

			if (maxOffset < 0x100)
			{
				return 1; 
			} else if (maxOffset < 0x10000)
			{
				return 2; 
			} else if (maxOffset < 0x1000000)
			{
				return 3; 
			}

			return 4; 
		};

		INDEX.prototype.encode = function () {
			this.initBytes();

			var objectCount = this.objects.length; 

			if (objectCount == 0)
			{
				console.log('count is zero');
				return [0, 0];
			}
			
			// objectCount ushort  16 바이트 2자리 숫자 
			this.put(CFFTypes.encode.convert('uint16', objectCount));

	
			// object convert to bytes 
			var convertedObjectBytes = this.convertObjectBytes();
 
			var offsetArray = [1]; // 최초 1부터 시작 
			convertedObjectBytes.forEach(function(v) {
				offsetArray.push(offsetArray[offsetArray.length-1] + v.length);
			});

			
			var encodedOffsets = [];
			var offsize = this.calcOffsetSize(offsetArray[offsetArray.length - 1]);
			console.log('writer offsize', offsize, offsetArray[offsetArray.length-1]);
			var offsetEncodeType = [undefined, 'byte', 'ushort', 'unit24', 'ulong'][offsize];
			
			for(var i = 0, len = offsetArray.length; i < len; i++) {
				var encodedOffset = CFFTypes.encode.convert(offsetEncodeType, offsetArray[i]);
				encodedOffsets = encodedOffsets.concat(encodedOffset);
			}

			this.put(CFFTypes.encode.convert('offsize', offsize));

			this.put(encodedOffsets);

			var self = this;
			convertedObjectBytes.forEach(function(v) {
				self.put(v);
			});

			return this.getBytes(); 
		}

		INDEX.prototype.getByte = function (object) {
			return CFFTypes.encode.convert(object.type, object.value);
		}

		INDEX.prototype.getSize = function (object) {
			return CFFTypes.sizeof.convert(object.type, object.value);
		}

		INDEX.prototype.convertObjectBytes = function () {
			var self = this; 
			return this.objects.map(function (object) {
				return self.getByte(object);
			});
		}

		INDEX.prototype.convertObjectSize = function () {
			var self = this; 
			return this.objects.map(function (object) {
				return self.getSize(object);
			});
		}

		INDEX.prototype.sizeof = function () {
			return this.encode().length;  
		}

       
        return INDEX;
    }
);
