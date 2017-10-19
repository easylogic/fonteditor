/**
 * @file 获取当前设备的像素比率
 * @author mengke01(kekee000@gmail.com)
 */
define(
    function (require) {

        var pixelRatio = (function () {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                backingStore = context.backingStorePixelRatio ||
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
