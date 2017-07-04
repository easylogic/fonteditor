/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var CFFTypes = require('./CFFTypes');
		var DICT = require('./DICT');
		
        function makeFontDict(array, strings) {
			return array.map(function (attrs, idx) {
				return { name : 'fd-' + idx, type : 'dict', value : new DICT(CFFTypes.makeDict(CFFTypes.TOP_DICT_META, attrs, strings)) };
			});
        }

        return makeFontDict;
    }
);
