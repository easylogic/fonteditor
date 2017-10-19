/**
 * @file 层级基础对象
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var pixelRatio = require('common/getPixelRatio');
        var guid = require('./util/guid');
        var lang = require('common/lang');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        /**
         * 创建一个shape对象，这里仅创建数据结构，具体绘制由Shape对象完成
         *
         * @param {Object} options shape参数
         * @param {string} options.id 编号
         * @param {string} options.type 类型
         *
         * @return {Object} shape数据结构
         */
        function createShape(options) {
            options = options || {};
            options.id = options.id || guid('shape');
            options.type = options.type || 'circle';
            options.layerId = this.id;
            return options;
        }


        /**
         * 设置canvas的绘制样式
         *
         * @param {CanvasRenderingContext2D} context canvas context
         * @param {Object} options 绘制参数
         */
        function setContextStyle(context, options) {
            context.fillStyle = options.fillColor || '#00ff33';
            context.strokeStyle = options.strokeColor || '#00ff33';
            context.lineWidth = options.lineWidth || 1;
            context.font = options.font || 'normal 18px arial';
        }

		function getRandomColor() {
			return "#" + (Math.round(Math.random() * 0XFFFFFF)).toString(16);
		}

        /**
         * 层级基础对象
         *
         * @constructor
         * @param {CanvasRenderingContext2D} context canvas context
         * @param {Object} options 绘制参数
         * @param {boolean} options.stroke 是否描边
         * @param {boolean} options.fill 是否填充
         * @param {boolean} options.thin 是否细线模式
         * @param {Painter} options.painter 父级Painter对象
         * @param {string} options.id 对象编号
         * @param {number} options.level 层级
         */
        function Layer(context, options) {
            this.context = context;

            this.options = lang.extend({
                stroke: true, // 是否描边
                fill: true, // 是否填充
                thin: true // 是否细线模式
            }, options);

            this.painter = this.options.painter;
            this.id = this.options.id || guid('layer');
            this.level = this.options.level;
            this.shapes = [];
            this.disabled = false;
        }


        Layer.prototype = {

            constructor: Layer,

            /**
             * 刷新layer
             *
             * @return {this}
             */
            refresh: function () {

                var support = this.painter.support;
                var context = this.context;
                var options = this.options;
                var camera = this.painter.camera;

                context.clearRect(0, 0, this.painter.width * pixelRatio * 2 , this.painter.height * pixelRatio * 2);
                $("#layerLog").html([
                    context.canvas.width, 
                    context.canvas.height, 
                    context.canvas.style.width, 
                    context.canvas.style.height,         
                    window.devicePixelRatio,           
                    pixelRatio,
                    camera.ratio,
                    camera.scale,
                    camera.x,
                    camera.y
                ].join(','));
                setContextStyle(context, options);

                // 细线模式
                if (false !== options.thin) {
                    context.translate(-0.5, -0.5);
                }

                context.scale(pixelRatio, pixelRatio);
                context.beginPath();

                var shapes = this.shapes;
                var shape;
                var drawer;

                for (var i = 0, l = shapes.length; i < l; i++) {

                    shape = shapes[i];

                    if (true === shape.disabled) {
                        continue;
                    }

                    if ((drawer = support[shape.type])) {
                        if (camera.ratio !== 1) {
                            drawer.adjust(shape, camera);
                        }

                        if (shape.style) {

                            // 绘制之前shape
                            if (false !== options.fill) {
                                context.fill();
                            }

                            if (false !== options.stroke) {
                                context.stroke();
                            }

                            // 绘制当前shape
                            context.beginPath();
                            setContextStyle(context, shape.style);
                            drawer.draw(context, shape, camera);

                            if (false !== options.fill || shape.style.fill) {
                                context.fill();
                            }

                            if (false !== options.stroke || shape.style.stroke) {
                                context.stroke();
                            }

                            // 重置
                            setContextStyle(context, options);
                            context.beginPath();
                        }
                        else {
                            drawer.draw(context, shape, camera);
                        }
                    }
                }

                if (false !== options.fill) {
                    context.fill();
                }

                if (false !== options.stroke) {
                    context.stroke();
                }

                if (false !== options.thin) {
                    context.translate(0.5, 0.5);
                }


                return this;
            },

            /**
             * 根据编号或索引获取一个Shape
             *
             * @param {string|number} shape id或者shape index
             *
             * @return {Object} shape对象
             */
            getShape: function (shape) {
                if (typeof shape === 'string') {
                    return this.shapes.filter(function (item) {
                        return item.id === shape;
                    })[0];
                }
                else if (typeof shape === 'number') {
                    return this.shapes[shape];
                }
                else if (typeof shape === 'object') {
                    return shape;
                }
            },

            /**
             * 添加一个Shape
             *
             * @param {string} shape Shape 类型， 或者 Shape 对象
             * @param {Object} options Shape相关参数
             *
             * @return {Object} Shape对象
             */
            addShape: function (shape, options) {
                if (typeof shape === 'string') {
                    options = options || {};
                    options.type = shape;
                    shape = createShape.call(this, options);
                    this.shapes.push(shape);
                    return shape;
                }
                else if (typeof shape === 'object') {
                    this.shapes.push(shape);
                    return shape;
                }

                throw 'add shape faild';
            },

            /**
             * 移除一个Shape
             *
             * @param {Shape|string|number} shape Shape对象或者ID或者索引号
             *
             * @return {boolean} 是否成功
             */
            removeShape: function (shape) {
                var id = -1;
                if (typeof shape === 'object') {
                    id = this.shapes.indexOf(shape);
                }
                else if (typeof shape === 'string') {
                    for (var i = 0, l = this.shapes.length; i < l; i++) {
                        if (shape === this.shapes[i].id) {
                            id = i;
                            break;
                        }
                    }
                }
                else if (typeof shape === 'number') {
                    id = shape;
                }
                else {
                    throw 'need shape id to be removed';
                }

                if (id >= 0 && id < this.shapes.length) {
                    this.shapes.splice(id, 1);
                    return true;
                }

                return false;
            },

            /**
             * 清空所有的shapes
             *
             * @return {this}
             */
            clearShapes: function () {
                this.shapes.length = 0;
                this.shapes = [];
                return this;
            },

            /**
             * 获取当前坐标下的shape
             *
             * @param {Object} p 坐标值
             * @return {Array|boolean} 选中的shapes 或者false
             */
            getShapeIn: function (p) {
                var support = this.painter.support;
                var shapes = this.shapes;
                var result = [];

                for (var i = 0, l = shapes.length; i < l; i++) {
                    if (
                        false !== shapes[i].selectable
                        && support[shapes[i].type].isIn(shapes[i], p.x, p.y)
                    ) {
                        result.push(shapes[i]);
                    }
                }
                return result.length ? result : false;
            },

			filterShape : function (callback) {
				var result = [];
                var shapes = this.shapes;
				for (var i = 0, l = shapes.length; i < l; i++) {
                    if ( callback.call(this, shapes[i]) == true ) {
                        result.push(shapes[i]);
                    }
                }

				return result; 
			},

            /**
             * 根据镜头调整shape
             *
             * @param {Object|string|number} shape shape对象
             * @return {this}
             */
            adjust: function (shape) {

                var shapes = [];
                if (shape) {
                    shape = this.getShape(shape);
                    shapes.push(shape);
                }
                else {
                    shapes = this.shapes;
                }

                var support = this.painter.support;
                var camera = this.painter.camera;
                var drawer;

                for (var i = 0, l = shapes.length; i < l; i++) {

                    shape = shapes[i];
                    if ((drawer = support[shape.type])) {
                        //if (camera.ratio !== 1) {			// ratio  가 1 일 때는 왜 안했지? 
                            drawer.adjust(shape, camera);
                        //}
                    }

                }

                return this;
            },

            /**
             * 移动指定的偏移量
             *
             * @param {number} x 오프셋
             * @param {number} y 오프셋
             * @param {Object|string|number} shape shape对象
             * @return {this}
             */
            move: function (x, y, shape) {

                var shapes = [];
                if (shape) {
                    shape = this.getShape(shape);
                    shapes.push(shape);
                }
                else {
                    shapes = this.shapes;
                }

                var support = this.painter.support;
                var drawer;

                for (var i = 0, l = shapes.length; i < l; i++) {

                    shape = shapes[i];
                    if ((drawer = support[shape.type])) {
                        drawer.move(shape, x, y);
                    }

                }

                return this;
            },

            /**
             * 移动到指定的位置, 相对于对shape的中心点
             *
             * @param {number} x 偏移
             * @param {number} y 偏移
             * @param {Object|string|number} shape shape对象
             * @return {this}
             */
            moveTo: function (x, y, shape) {

                var shapes = [];
                if (shape) {
                    shape = this.getShape(shape);
                    shapes.push(shape);
                }
                else {
                    shapes = this.shapes;
                }

                var support = this.painter.support;
                var drawer;
                var bound = this.getBound(shapes);

                if (bound) {
                    var mx = x - (bound.x + bound.width / 2);
                    var my = y - (bound.y + bound.height / 2);

                    for (var i = 0, l = shapes.length; i < l; i++) {
                        shape = shapes[i];
                        if ((drawer = support[shape.type])) {
                            drawer.move(shape, mx, my);
                        }
                    }
                }

                return this;
            },

            /**
             * 获取Layer bound
             *
             * @param {Array=} shapes shape对象数组
             * @return {Object} bound对象
             */
            getBound: function (shapes) {
                shapes = shapes || this.shapes;

                if (shapes.length === 0) {
                    return false;
                }

                // 求所有图形的bound
                var shape;
                var drawer;
                var boundPoints = [];
                var support = this.painter.support;

                for (var i = 0, l = shapes.length; i < l; i++) {
                    shape = shapes[i];

                    if ((drawer = support[shape.type])) {
                        if (undefined !== shape.x && undefined !== shape.y) {
                            boundPoints.push(shape);
                        }
                        else {
                            var bound = drawer.getRect(shape);
                            if (bound) {
                                boundPoints.push(bound);
                                boundPoints.push(
                                    {x: bound.x + bound.width, y: bound.y + bound.height}
                                );
                            }
                        }
                    }
                }

                return computeBoundingBox.computeBounding(boundPoints);
            },

            /**
             * 获取当前坐标下的shape
             *
             * @param {Object} options 参数选项
             * @return {Object} shape对象
             */
            createShape: function (options) {
                return createShape.call(this, options);
            },

            /**
             * 注销
             */
            dispose: function () {
                this.main = this.painter = this.context = this.options = null;
                this.shapes.length = 0;
                this.shapes = null;
            },
			
			hide : function () {
				this.context.canvas.style.display = 'none';
			},

			show : function () {
				this.context.canvas.style.display = 'inline-block';
			},

			toggle : function (isShow) {
				if (typeof isShow == 'undefined')
				{
					isShow = this.context.canvas.style.display != 'none';
				} 
				
				this.context.canvas.style.display = !!isShow ? 'inline-block' : 'none';
				
			}
        };

        return Layer;
    }
);
