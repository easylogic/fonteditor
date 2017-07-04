/**
 * @file otf CFF  포맷에 헤더 쓰기 
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var TABLE = require('./TABLE');

        function makeHeader(cff) { 
			var arr = [
				{ name : 'major', type : 'Card8', value : 1 }, 	
				{ name : 'minor', type : 'Card8', value : 0 }, 	
				{ name : 'headerSize', type : 'Card8', value : 4 }
			];

			if (cff.head.formatMajor == 1) {
				arr.push({name : 'offsize', type : 'Card8', value : 1 });
			} else if (cff.head.formatMajor == 2){
				arr.push({name : 'offsize', type : 'Card8', value : 2 });
			}

			return new TABLE(arr);

        }

        return makeHeader;
    }
);
