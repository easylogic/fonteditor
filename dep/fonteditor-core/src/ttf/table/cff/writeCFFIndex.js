/**
 * @file cff表
 */

define(
		

    function (require) {

		var INDEX = require('./INDEX');
		

        function writeCFFIndex(writer, types) {
			var index = new INDEX(types);
			writer.writeBytes(index.encode());
			return index;
		}

       
        return writeCFFIndex;
    }
);
