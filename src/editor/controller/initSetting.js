/**
 * @file 初始化Editor设置
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var setSelectedCommand = require('../command/setSelectedCommand');
        var commandList = require('../menu/commandList');
        var lang = require('common/lang');

        function initSetting(options) {

            // 设置菜单选中状态

            setSelectedCommand(
                commandList.editor, 'setting.gridsorption',
                !!options.sorption.enableGrid
            );

            setSelectedCommand(
                commandList.editor, 'setting.shapesorption',
                !!options.sorption.enableShape
            );

            setSelectedCommand(
                commandList.editor, 'setting.showgrid',
                !!options.axis.showGrid
            );
        }

        /**
         * 设置选项
         *
         * @param {Object} options 选项
         * @param {Object} options.sorption 吸附设置
         * @param {Object} options.axis 坐标设置
         * @see editor/options
         */
        function setOptions(options) {

            this.execCommand('gridsorption', options.sorption.enableGrid);
            this.execCommand('shapesorption', options.sorption.enableShape);
            this.execCommand('showgrid', options.axis.showGrid);

            this.fontLayer.options.fill = !!options.fontLayer.fill;
            this.fontLayer.options.fillColor = options.fontLayer.fillColor;
            this.fontLayer.options.strokeColor = options.fontLayer.strokeColor;
            this.fontLayer.refresh();

            this.axis.gapColor = options.axis.gapColor;
            this.axis.metricsColor = options.axis.metricsColor;
            this.axis.emColor = options.axis.emColor;
            this.axis.graduation.gap = options.axis.graduation.gap || 100;
            this.axisLayer.refresh();
            this.graduationLayer.refresh();

            lang.overwrite(this.options, options);
        }

		function setFontOptions (options) {

			if (typeof options.fill != 'undefined') {
				this.fontLayer.options.fill = !!options.fill;
				this.options.fontLayer.fill = options.fill;
			}

			if (typeof options.fillColor != 'undefined') {
				this.fontLayer.options.fillColor = options.fillColor;
				this.options.fontLayer.fillColor = options.fillColor;
			}

			if (typeof options.strokeColor != 'undefined') {
				this.fontLayer.options.strokeColor = options.strokeColor;
				this.options.fontLayer.strokeColor = options.strokeColor;
			}

			this.fontLayer.refresh();

		}

        return function () {
            initSetting.call(this, this.options);
            this.setOptions = setOptions;
			this.setFontOptions = setFontOptions;
        };
    }
);
