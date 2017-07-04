/**
 * @file 获取当前设备的像素比率
 * @author mengke01(kekee000@gmail.com)
 */
define(
    function (require) {

		// 픽셀 레티오가 수시로 변해서 흠 머랄까. 
		// 실시간으로 다시 가지고 와야 할 수도 있다. 
		// 아무래도 펑션을 따로 만들어야할 듯 
        var pixelRatio = (function (context) {
            var backingStore = context.backingStorePixelRatio ||
                        context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;

            return (window.devicePixelRatio || 1) / backingStore;
        })(HTMLCanvasElement.prototype);

        return pixelRatio;
    }
);
