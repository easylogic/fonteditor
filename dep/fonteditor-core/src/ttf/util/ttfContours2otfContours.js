/**
 * @file otf轮廓转ttf轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var bezierQuad2Cubic = require('../../math/bezierQuad2Cubic');
        var pathCeil = require('../../graphics/pathCeil');

        /**
         * 转换轮廓
         * @param  {Array} otfContour otf轮廓
         * @return {Array}            ttf轮廓
         */
        function transformContour(otfContour) {
            var contour = [];
            var prevPoint;
            var curPoint;
            var nextPoint;
            var nextNextPoint;

            contour.push(prevPoint = otfContour[0]);
            for (var i = 1, l = otfContour.length; i < l; i++) {
                curPoint = otfContour[i];

                if (curPoint.onCurve) {			// 여기는 직선 
                    contour.push(curPoint);
                    prevPoint = curPoint;
                }
                // 三次bezier曲线
                else {							// 여기는 곡선 
                    nextPoint =  otfContour[i + 1];
                    var bezierArray = bezierQuad2Cubic(prevPoint, curPoint, nextPoint);

                    bezierArray[3].onCurve = true;

                    contour.push(bezierArray[1]);
                    contour.push(bezierArray[2]);
                    contour.push(bezierArray[3]);

                    prevPoint = nextPoint;
                    i += 1;
                }
            }

            return pathCeil(contour);
        }


        /**
         * otf轮廓转ttf轮廓
         * @param  {Array} otfContours otf轮廓数组
         * @return {Array} ttf轮廓
         */
        function ttfContours2otfContours(ttfContours) {
            if (!ttfContours || !ttfContours.length) {
                return ttfContours;
            }
            var contours = [];
            for (var i = 0, l = ttfContours.length; i < l; i++) {

                // 좌표가 정상적인 것만 처리 
                if (ttfContours[i][0]) {
                    contours.push(transformContour(ttfContours[i]));
                }
            }

            return contours;
        }

        return ttfContours2otfContours;
    }
);
