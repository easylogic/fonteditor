/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var CFFTypes = require('./CFFTypes');
		var TABLE = require('./TABLE');

        function makeFDSelect(font, fdarray) {

			var format = font.CFF.topDict.fdSelectFormat;
			var fields = [];

			fields.push({ name : 'cid font format', type : 'card8', value  : format }); 
			if (format == 0)
			{
				for(var i = 0, len = fdarray.length; i < len; i++) {
					fields.push({ name : 'fdselect-' + i, type : 'card8', value : i });
				}
			} else if (format == 3) {

				var ranges = font.CFF.ranges; 
				fields.push({ name : 'cid range count', type : 'uint16', value : ranges.length });

				for(var i = 0, len = ranges.length; i < len; i++) {
					var range = ranges[i];
					var firstIndex = range.firstIndex;
					var fdIndex = range.fdIndex; 
					var rangeFields = [
						{ name : 'first' , type : 'card8', value : firstIndex },
						{ name : 'fd', type : 'card8', value : fdIndex } 
					];

					fields.push({ name : 'cid range table', type : 'table', value : new TABLE(rangeFields) });
				}
			} 

			return new TABLE(fields);
        }

        return makeFDSelect;
    }
);
