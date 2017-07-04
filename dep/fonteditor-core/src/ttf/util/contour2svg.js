/**
 * @file 将ttf路径转换为svg路径`d`
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * 将路径转换为svg路径
         *
         * @param {Array} contour 轮廓序列
         * @param {number} precision 精确度
         * @return {string} 路径
         */
        function contour2svg(contour, precision) {
            precision = precision || 2;

            if (!contour.length) {
                return '';
            }

            var ceil = function (number) {
                return +(number).toFixed(precision);
            };
            var pathArr = [];
            var curPoint;
            var prevPoint;
            var nextPoint;
            var x; // x相对坐标
            var y; // y相对坐标
            for (var i = 0, l = contour.length; i < l; i++) {
                curPoint = contour[i];

				/*if (curPoint.type)     //  여긴  type  으로 otf  패스를 구분하기 때문에 아래의 공식을 따른다. 	
				{
					if (i == 0)
					{
						if (curPoint.type == 'lineTo'){
							pathArr.push('M' + ceil(curPoint.x) + ' ' + ceil(curPoint.y));
						}
					}

					if (curPoint.type == 'lineTo') {
						pathArr.push('L' + ceil(curPoint.x) + ' ' + ceil(curPoint.y));
					} else if (curPoint.type == 'curveTo') {
						var c1Point = curPoint;
						var c2Point = contour[++i];
						var cPoint = contour[++i];
						pathArr.push('C' + ceil(c1Point.x) + ' ' + ceil(c1Point.y)+ ' ' + ceil(c2Point.x)+ ' ' + ceil(c2Point.y)+ ' ' + ceil(cPoint.x)+ ' ' + ceil(cPoint.y));
					} else if (curPoint.type == 'closePath') {
						//pathArr.push('Z');
					}

				} else {*/
					prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
					nextPoint =  i === l - 1 ? contour[0] : contour[i + 1];

					// 起始坐标
					if (i === 0) {
						if (curPoint.onCurve) {
							x = curPoint.x;
							y = curPoint.y;
							pathArr.push('M' + ceil(x) + ' ' + ceil(y));
						}
						else {
							if (prevPoint.onCurve) {
								x = prevPoint.x;
								y = prevPoint.y;
								pathArr.push('M' + ceil(x) + ' ' + ceil(y));
							}
							else {
								x = (prevPoint.x + curPoint.x) / 2;
								y = (prevPoint.y + curPoint.y) / 2;
								pathArr.push('M' + ceil(x)  + ' ' + ceil(y));
							}
						}
					}

					// 直线
					if (curPoint.onCurve && nextPoint.onCurve) {
						pathArr.push('l' + ceil(nextPoint.x - x)
							+ ' ' + ceil(nextPoint.y - y));
						x = nextPoint.x;
						y = nextPoint.y;
					}
					else if (!curPoint.onCurve) {
						if (nextPoint.onCurve) {
							pathArr.push('q' + ceil(curPoint.x - x)
								+ ' ' + ceil(curPoint.y - y)
								+ ' ' + ceil(nextPoint.x - x)
								+ ' ' + ceil(nextPoint.y - y));
							x = nextPoint.x;
							y = nextPoint.y;
						}
						else {
							var x1 = (curPoint.x + nextPoint.x) / 2;
							var y1 = (curPoint.y + nextPoint.y) / 2;
							pathArr.push('q' + ceil(curPoint.x - x)
								 + ' ' + ceil(curPoint.y - y)
								 + ' ' + ceil(x1 - x)
								 + ' ' + ceil(y1 - y));
							x = x1;
							y = y1;
						}
					}
				/* } */
                
            }
            pathArr.push('Z');
            return pathArr.join(' ');
        }

        return contour2svg;
    }
);
