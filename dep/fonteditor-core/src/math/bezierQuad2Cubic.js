/**
 * @file quad 를 cubic bezier 로 변경 
 * @author easylogic(cyberuls@gmail.com)
 *
 * references:
 * https://github.com/search?utf8=%E2%9C%93&q=svg2ttf
 * https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic
 *
 */

define(function (require) {

    function toCubic(p1, p2) {
        // Quad control point is (3*c2 - p2 + 3*c1 - p1)/4
        var x = p1.x + (2/3) * (p2.x - p1.x);
		var y = p1.y + (2/3) * (p2.y - p1.y);

        return {
			x : x,
			y : y 
		};
    }


    /**
     * 三次贝塞尔转二次贝塞尔
     *
     * @param {Object} p1 开始点
     * @param {Object} c1 控制点1
     * @param {Object} c2 控制点2
     * @param {Object} p2 结束点
     * @return {Array} 二次贝塞尔控制点
     */
    function bezierQuad2Cubic(p0, p1, p2) {
		var c0 = p0;
		var c3 = p2; 

		var c1 = toCubic(p0 , p1);
		var c2 = toCubic(p2 , p1);

		return [
			c0,
			c1,
			c2,
			c3
		];
    }

    return bezierQuad2Cubic;
});
