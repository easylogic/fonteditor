/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var INDEX = require('./INDEX');

        function makeNameIndex(fontNames) {

			return new INDEX([
				{ type : 'string', value : fontNames[0]}
			]);
        }

        return makeNameIndex;
    }
);
