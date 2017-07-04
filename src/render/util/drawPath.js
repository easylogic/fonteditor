/**
 * @file 绘制contour曲线
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * ctx绘制轮廓
         *
         * @param {CanvasRenderingContext2D} ctx canvas会话
         * @param {Array} contour 轮廓序列
         */
        function drawPath(ctx, contour) {

            var curPoint;
            var prevPoint;
            var nextPoint;
            for (var i = 0, l = contour.length; i < l; i++) {
                curPoint = contour[i];

				/*if (curPoint.type) {
					if (i == 0)
					{
						if (curPoint.type == 'lineTo'){
							ctx.moveTo(curPoint.x, curPoint.y);
						}
					}

					if (curPoint.type == 'lineTo') {
						ctx.lineTo(curPoint.x, curPoint.y);
					} else if (curPoint.type == 'curveTo') {
						var c1Point = curPoint;
						var c2Point = contour[++i];
						var cPoint = contour[++i];

						ctx.bezierCurveTo(c1Point.x, c1Point.y, c2Point.x, c2Point.y, cPoint.x, cPoint.y);
					} else if (curPoint.type == 'closePath') {
						ctx.closePath();
					}


				} else {*/

					prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
					nextPoint =  i === l - 1 ? contour[0] : contour[i + 1];

					// 좌표 시작 
					if (i === 0) {
						if (curPoint.onCurve) {
							ctx.moveTo(curPoint.x, curPoint.y);
						}
						else {
							if (prevPoint.onCurve) {
								ctx.moveTo(prevPoint.x, prevPoint.y);
							}
							else {
								ctx.moveTo((prevPoint.x + curPoint.x) / 2, (prevPoint.y + curPoint.y) / 2);
							}
						}
					}

					// 일직선
					if (curPoint.onCurve && nextPoint.onCurve) {	// 현재 점과 nextpoint 가 onCurve 이면 둘다 일직선으로 연결된다. 
						ctx.lineTo(nextPoint.x, nextPoint.y);
					}
					else if (!curPoint.onCurve) {
						if (nextPoint.onCurve) {
							ctx.quadraticCurveTo(curPoint.x, curPoint.y, nextPoint.x, nextPoint.y);
						}
						else {
							ctx.quadraticCurveTo(
								curPoint.x, curPoint.y,
								(curPoint.x + nextPoint.x) / 2, (curPoint.y + nextPoint.y) / 2
							);
						}
					}
				/*}*/


            }
        }

        return drawPath;
    }
);
