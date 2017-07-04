/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var CFFTypes = require('./CFFTypes');

		

        function makeTopDict(attrs, strings) {
			return CFFTypes.makeDict(CFFTypes.TOP_DICT_META, attrs, strings);

        }

        return makeTopDict;
    }
);
