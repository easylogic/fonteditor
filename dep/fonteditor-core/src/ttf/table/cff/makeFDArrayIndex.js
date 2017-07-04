/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var CFFTypes = require('./CFFTypes');
		var INDEX = require('./INDEX');
		

        function makeFDArrayIndex(fontDict) {
			return new INDEX(fontDict);
        }

        return makeFDArrayIndex;
    }
);
