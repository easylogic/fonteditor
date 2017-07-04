/**
 * @file 矩形绘制
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var proto = {

            type: 'image',

            getRect: function (shape) {
                return shape;
            },

            isIn: function (shape, x, y) {
                var w = shape.width;
                var h = shape.height;
                return x <= shape.x + w
                    && x >= shape.x
                    && y <= shape.y + h
                    && y >= shape.y;
            },

            draw: function (ctx, shape) {

                var x = Math.round(shape.x);
                var y = Math.round(shape.y);
                var w = Math.round(shape.width);
                var h = Math.round(shape.height);

				ctx.drawImage(shape.url, x, y, w, h);
            }
        };


        return require('./Shape').derive(proto);
    }
);
