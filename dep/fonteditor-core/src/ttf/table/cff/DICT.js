/**
 * @file cff表
 */

define(
		

    function (require) {

		var CFFTypes = require('./CFFTypes');

		function DICT(objects) {
			this.objects = objects; 
			this.initBytes();
		}

		DICT.prototype.initBytes = function () {
			this.bytes = []; 
		}

		DICT.prototype.getBuffer = function () {
			return new Uint8Array(this.getBytes()).buffer; 
		}

		DICT.prototype.getBytes = function () {
			return this.bytes; 
		}

		DICT.prototype.put = function (arr) {
			this.bytes = this.bytes.concat(arr);
		}

		DICT.prototype.encode = function () {
			this.initBytes();
	
			var keys = Object.keys(this.objects);
			var count = keys.length; 

			this.put(CFFTypes.encode.convert('uint16', count));

			this.convertObjectBytes();

			return this.getBytes(); 
		}

		DICT.prototype.getByte = function (object) {
			return CFFTypes.encode.convert(object.type, object.value);
		}

		DICT.prototype.getSize = function (object) {
			return CFFTypes.sizeof.convert(object.type, object.value);
		}

		DICT.prototype.convertObjectBytes = function () {
			var keys = Object.keys(this.objects);
			var count = keys.length; 
			for(var i = 0, len = count; i < len; i++) {
				var op = +keys[i];
				var object = this.objects[op];

				if (op >= 1200)		// 1200  이 넘는건 2개로 쪼개서 저장 
				{
					this.put([12, op-1200]);
				} else {
					this.put(op);
				}

				this.put(this.getByte(object));

			}
		}

		DICT.prototype.convertObjectSize = function () {
			var keys = Object.keys(this.objects);
			var count = keys.length; 
			var total = 0; 

			for(var i = 0, len = count; i < len; i++) {
				var op = +keys[i];
				var object = this.objects[op];

				if (op >= 1200)		// 1200  이 넘는건 2개로 쪼개서 저장 
				{
					total += 2; 
				} else {
					total += 1;
				}


				total += this.getSize(object);

			}

			return total;
		}

		DICT.prototype.sizeof = function () {
			var total = 0;

			// add object count 
			total += CFFTypes.sizeof.uint16(); 
			
			// object convert to bytes 
			total += this.convertObjectSize();

			return total; 
		}

       
        return DICT;
    }
);
