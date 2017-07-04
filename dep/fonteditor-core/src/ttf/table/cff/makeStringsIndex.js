/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var INDEX = require('./INDEX');

        function makeStringIndex(strings) {

			var arr = [];
			for (var i = 0; i < strings.length; i += 1) {
				arr.push({name: 'string_' + i, type: 'STRING', value: strings[i]});
			}
			return new INDEX(arr);

        }

        return makeStringIndex;
    }
);
