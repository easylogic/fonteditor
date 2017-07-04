/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var INDEX = require('./INDEX');
		var DICT = require('./DICT');

        function makeTopDictIndex(topDict) {
			console.log(topDict);
			return new INDEX([
				{ type : 'dict', value : new DICT(topDict) }
			]);

        }

        return makeTopDictIndex;
    }
);
