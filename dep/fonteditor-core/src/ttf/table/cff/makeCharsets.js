/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var CFFTypes = require('./CFFTypes');
		var TABLE = require('./TABLE');

        function makeCharsets(glyphNames, strings) {
			var charsets = CFFTypes.makeCharsets(glyphNames, strings);
			var charsetTable = new TABLE(charsets);

			return charsetTable;

		}

        return makeCharsets;
    }
);
