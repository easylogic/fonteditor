/**
 * @file otf格式转ttf格式对象
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var error = require('./error');
        var OTFReader = require('./otfreader');
        var otfContours2ttfContours = require('./util/otfContours2ttfContours');
        var computeBoundingBox = require('../graphics/computeBoundingBox');

        /**
         * otf格式转ttf格式对象
         * @param  {ArrayBuffer|otfObject} otfBuffer 原始数据或者解析后的otf数据
         * @param  {Object} options   参数
         * @return {Object}          ttfObject对象
         */
        function otf2ttfobject(otfBuffer, options) {
            var otfObject;
            if (otfBuffer instanceof ArrayBuffer) {
                var otfReader = new OTFReader(options);
                otfObject = otfReader.read(otfBuffer);
                otfReader.dispose();
            }
            else if (otfBuffer.head && otfBuffer.glyf && otfBuffer.cmap) {
                otfObject = otfBuffer;
            }
            else {
                error.raise(10111);
            }

            // 转换otf轮廓
            otfObject.glyf.forEach(function (g) {
				// otf 의 경우 otf 형태로 그대로 외곽선 편집 기능을 넣을 예정이기 때문에 
				// otf 좌표를 ttf 형태로 변환하지 않고 사용한다. 
				// 나중에 otf 폰트를 ttf 형태로 실제로 변환할일이 있을 때 사용한다. 
				//if (options.convertTTFContours){
					g.contours = otfContours2ttfContours(g.contours);  // 기본 로직 구현으로 갑시다. 
				//}

                var box = computeBoundingBox.computePathBox.apply(null, g.contours);
                if (box) {
                    g.xMin = box.x;
                    g.xMax = box.x + box.width;
                    g.yMin = box.y;
                    g.yMax = box.y + box.height;
                    g.leftSideBearing = g.xMin;
					g.rightSideBearing = g.advanceWidth - box.x - box.width;
                }
                else {
                    g.xMin = 0;
                    g.xMax = 0;
                    g.yMin = 0;
                    g.yMax = 0;
                    g.leftSideBearing = 0;
		            g.rightSideBearing = g.advanceWidth;
                }
            });

            otfObject.version = 0x1;

            // 修改maxp相关配置
            otfObject.maxp.version = 1.0;
            otfObject.maxp.maxZones = otfObject.maxp.maxTwilightPoints ? 2 : 1;

            delete otfObject.CFF;    // CFF 테이블은 otf 외곽선 에디터가 완벽해질때 넣는다. 
            delete otfObject.VORG;

            return otfObject;
        }

        return otf2ttfobject;
    }
);
