/**
 * @file 默认的渲染控制器，仅实现基本的缩放平移控制
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var selectShape = require('./util/selectShape');


        function down (e, render) {
            var result = render.getLayer('cover').getShapeIn(e);
            
            if (result) {
                render.selectedShape = result[0];
            }
            else {
                result = render.getLayer('font').getShapeIn(e);
                if (result.length > 1) {
                    render.selectedShape = selectShape(result, e);
                }
                else {
                    render.selectedShape = result[0];
                }
            }


            render.camera.x = e.x;
            render.camera.y = e.y;
            
        }

        function drag (e, render) {
            var shape = render.selectedShape;
            if (shape) {
                render.getLayer(shape.layerId)
                    .move(e.x - render.camera.x, e.y - render.camera.y, shape)
                    .refresh();
            }
            else {
                render.move(e.x - render.camera.x, e.y - render.camera.y)
                    .refresh();
            }
            render.camera.x = e.x;
            render.camera.y = e.y;
        }

        function dragend(e, render) {
            var shape = render.selectedShape;
            if (shape) {
                render.getLayer(shape.layerId)
                    .move(e.x - render.camera.x, e.y - render.camera.y, shape)
                    .refresh();
                render.selectedShape = null;
            }
            else {
                render.painter.refresh();
            }
        }

        /**
         * 初始化
         */
        function initRender() {

            var render = this.render;

            [
                // mouse 
                render.capture, 
                // touch 
                render.touchCapture 
                
            ].forEach(function (capture) {

                capture.on('down', function (e) {
                    down(e, render);
                });

                capture.on('drag', function (e) {
                    drag(e, render);
                });

                capture.on('dragend', function (e) {
                    dragend(e, render);
                });
            })

        }


        /**
         * Render控制器
         * @param {Object} options 参数
         * @constructor
         */
        function Controller(options) {
            this.options = options || {};
        }

        /**
         * 设置render对象
         *
         * 所有的controller都需要实现此接口
         * @param {Render} render render对象
         * @return {this}
         */
        Controller.prototype.setRender = function (render) {
            this.render = render;
            initRender.call(this);
            return this;
        };

        /**
         * 注销
         */
        Controller.prototype.dispose = function () {
            this.render && this.render.dispose();
            this.options = this.render = null;
        };

        return Controller;
    }
);
