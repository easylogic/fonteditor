/**
 * @file 编辑器相关命令
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var lang = require('common/lang');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var commandList = require('../menu/commandList');
        var shapesSupport = require('../shapes/support');
        var setSelectedCommand = require('./setSelectedCommand');

        return {

            /**
             * 줌 리셋
             */
            rescale: function (scale) {

                this.coverLayer.clearShapes();
                var size = this.render.getSize();

                scale = scale || (512 / this.options.unitsPerEm);
				var distX = 0;

				if (this.options.simple)   //   simple  모드에서는 스케일을 고정시킨다.  0.5 로 
				{
					//scale = 0.5;
				}
				
                this.render.scaleTo(scale, {
                    x: size.width / 2,
                    y: size.height / 2
                });	// adjust  한다음  refresh  할 텐데 
                this.setMode();
            },

            /**
             * 확대
             */
            enlargeview: function () {
                var size = this.render.getSize();
                this.render.scale(1.25, {
                    x: size.width / 2,
                    y: size.height / 2
                });
            },

            /**
             * 축소
             */
            narrowview: function () {
                var size = this.render.getSize();
                this.render.scale(0.8, {
                    x: size.width / 2,
                    y: size.height / 2
                });
            },
 
			//  direction  에 따라 화면 이동하기 
			moveview : function (obj) {
				this.move(obj.direction);
			},

            /**
             * 되돌리기
             */
            undo: function () {
                var shapes = this.history.back();
                this.fontLayer.shapes.length = 0;
                this.addShapes(shapes);
                this.setMode();
            },

            /**
             * 다시실행하기
             */
            redo: function () {
                var shapes = this.history.forward();
                this.fontLayer.shapes.length = 0;
                this.addShapes(shapes);
                this.setMode();
            },

			/**
			 * 캔버스 크기 조정하기 
			 *
			 */
			resize : function () {
				this.render.resize();
			},

            /**
             * 是否打开网格吸附
			 *
			 * Grid  에 붙이기 
             * @param {boolean} enabled 是否
             */
            gridsorption: function (enabled) {
                setSelectedCommand(commandList.editor, 'setting.gridsorption', !!enabled);
                this.options.sorption.enableGrid = this.sorption.enableGrid = !!enabled;
            },

            /**
             * 是否打开轮廓吸附
			 * 
			 * shape  에 붙이기 
             * @param {boolean} enabled 是否
             */
            shapesorption: function (enabled) {
                setSelectedCommand(commandList.editor, 'setting.shapesorption', !!enabled);
                this.options.sorption.enableShape = this.sorption.enableShape = !!enabled;
            },

            /**
             * 그리드 보기 설정 
             * @param {boolean} enabled 是否
             */
            showgrid: function (enabled) {
				if (typeof enabled == 'undefined')
				{
					enabled = !this.options.axis.showGrid;
				}

                setSelectedCommand(commandList.editor, 'setting.showgrid', !!enabled);
                this.options.axis.showGrid = this.axis.showGrid = !!enabled;
                this.axisLayer.refresh();
            },

			/**
			 * outline 보기 설정 (폰트 색상을 채우지 않음) 
			 *
			 */
			showoutline : function (enabled) {
				if (typeof enabled == 'undefined')
				{
					enabled = !this.options.fontLayer.fill;
				}

				this.setFontOptions({ fill : enabled  });
			},

			/**
			 * 축의 기본 정보 보이기 안보이기 설정 
			 *
			 */
			showaxis : function () {
				this.options.axis.hide = !this.options.axis.hide;
				this.axisLayer.toggle(!this.options.axis.hide);
			},

			/**
			 * 레퍼런스 라인 기본 정보 보이기 안보이기 설정 
			 *
			 */
            showreference : function () {
				this.options.referenceline.hide = !this.options.referenceline.hide;
				this.referenceLineLayer.toggle(!this.options.referenceline.hide);
            },

            /**
             * 更多设置
             */
            moresetting: function () {
                this.fire('setting:editor', {
                    setting: this.options
                });
            },

            /**
             * 添加path
			 *  path  추가 모드 변경 
             */
            addpath: function () {
                var me = this;
                // 此处由于监听down事件，需要延迟处理
                setTimeout(function () {
                    me.setMode('addpath');
                }, 20);
            },

            /**
             * 添加自选图形
             *
             * 특정 모양 추가하기 
             *
             * @param {string} type 图形类型
             */
            addsupportshapes: function (type) {
                if (shapesSupport[type]) {
                    this.setMode('addshapes', lang.clone(shapesSupport[type]));
                }
            },

            addglyfshapes: function (shape) {
                // 한번에 붙이는게 없다. 
            },            

			'import-pic' : function () {
				console.log(this);
			},

            /**
             * 设置字体信息
             */
            fontsetting: function () {

                // 计算边界
                var box = computeBoundingBox.computePathBox.apply(
                    null,
                    this.fontLayer.shapes.map(function (shape) {
                        return shape.points;
                    })
                );

                var leftSideBearing = 0;
                var rightSideBearing = 0;

                if (box) {
                    var scale = this.render.camera.scale;
                    leftSideBearing = (box.x - this.axis.x) / scale;
                    rightSideBearing = (this.rightSideBearing.p0.x - box.x - box.width) / scale;
                }

                if (this.font) {
                    this.fire('setting:font', {
                        setting: {
                            leftSideBearing: Math.round(leftSideBearing),
                            rightSideBearing: Math.round(rightSideBearing || 0),
                            unicode: this.font.unicode,
                            name: this.font.name
                        }
                    });
                }
            }
        };
    }
);
