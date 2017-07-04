/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var CFFTypes = require('./CFFTypes');
		var TABLE = require('./TABLE');


        function makeCharStringIndex(glyphs) {

			var meta = glyphs.map(function(glyf) {
				var ops = CFFTypes.glyphToOps(glyf);
				return { name : glyf.name, type : 'CHARSTRING', value : ops }
			});
			return new TABLE(meta);

        }

        return makeCharStringIndex;
    }
);
