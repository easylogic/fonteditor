/**
 * @file 直线绘制
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var dashedLineTo = require('../util/dashedLineTo');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        var proto = {

            type: 'line',

            adjust: function (shape, camera) {
				var notScaled = !!shape.notScaled;
                var center = camera.center;
                var ratio = camera.ratio;

                if (undefined !== shape.p0.x) {
                    shape.p0.x = ratio * (shape.p0.x - center.x) + center.x;

					if (notScaled)
					{
						shape.p0.y = ratio * (shape.p0.y - center.y) + center.y;
					}
                }
                else {
                    shape.p0.y = ratio * (shape.p0.y - center.y) + center.y;
                }

                if (undefined !== shape.p1) {
                    shape.p1.x = ratio * (shape.p1.x - center.x) + center.x;
                    shape.p1.y = ratio * (shape.p1.y - center.y) + center.y;
                }

                return shape;
            }, 

            move: function (shape, mx, my) {
				var notScaled = !!shape.notScaled;
                if (undefined !== shape.p0.x) {
                    shape.p0.x += mx;

					if (notScaled)
					{
						shape.p0.y += my;
					}
                }
                else {
                    shape.p0.y += my;
                }

                if (undefined !== shape.p1) {
                    shape.p1.x += mx;
                    shape.p1.y += my;
                }
                return shape;
            },

            getRect: function (shape) {
                return undefined === shape.p1
                    ? false
                    : computeBoundingBox.computeBounding([shape.p0, shape.p1]);
            },

            isIn: function (shape, x, y) {

                // 단일 포인트 모드
                if (undefined === shape.p1) {
                    return  undefined !== shape.p0.x && Math.abs(shape.p0.x - x) < 4
                        || undefined !== shape.p0.y && Math.abs(shape.p0.y - y) < 4;
                }

                var x0 = shape.p0.x;
                var y0 = shape.p0.y;
                var x1 = shape.p1.x;
                var y1 = shape.p1.y;
                return (y - y0) * (x - x1) === (y - y1) * (x - x0);
            },

            /**
             * Shape 객체 그리기
             *
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function (ctx, shape , camera) {

                var x0;
                var y0;
                var x1;
                var y1;

                // 单点模式
                if (undefined === shape.p1) {

                    if (undefined !== shape.p0.x) {
                        x0 = Math.round(shape.p0.x);
                        ctx.moveTo(x0, 0);
                        ctx.lineTo(x0, ctx.canvas.height);
                    }
                    else {
                        y0 = Math.round(shape.p0.y);
                        ctx.moveTo(0, y0);
                        ctx.lineTo(ctx.canvas.width, y0);
                    }

                }
                else {
                    x0 = Math.round(shape.p0.x);
                    y0 = Math.round(shape.p0.y);
                    x1 = Math.round(shape.p1.x);
                    y1 = Math.round(shape.p1.y);

                    if (shape.dashed) {
                        dashedLineTo(ctx, x0, y0, x1, y1, 3);
                    }
                    else {
                        ctx.moveTo(x0, y0);
                        ctx.lineTo(x1, y1);
                    }
                }

                if (shape.id == 'sorptionX') {
                    var minY = Math.min(y0, y1);
                    var maxY = Math.max(y0, y1);
                    var distY = (maxY - minY);
                    var centerY = minY + (distY / 2) ; 
                    var posY = Math.abs(maxY - minY) *(1/camera.scale) ;    // 좌표 값을 실제 값으로 변환 
                    ctx.textAlign = "left";
                    ctx.textBaseline = "middle";
                    ctx.fillText(posY, x0 + 2, centerY);
                } else if (shape.id == 'sorptionY') {
                    var minX = Math.min(x0, x1);
                    var maxX = Math.max(x0, x1);
                    var distX = (maxX - minX);
                    var centerX = minX + (distX / 2) ; 
                    var posX = distX  * (1/camera.scale);    // 좌표 값을 실제 값으로 변환 
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    ctx.fillText(posX, centerX, y0);
                }

            }
        };


        return require('./Shape').derive(proto);
    }
);
