/**
 * @file Color Palette
 * @author easylogic(cyberuls@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../../i18n/i18n');
        var lang = require('../../../common/lang');
        var tpl = require('../../template/innerdialog/setting-color-palette.tpl');
        var string = require('fonteditor-core/ttf/util/string');
        var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;
		var program = require('../program');

        return require('./setting').derive({

			id : 'innerdialog-setting-color-palette',

			// style , rectangle 
//			right: 0,
//			bottom: 40,
			width: '100%',
			height: 180,

            title: i18n.lang.dialog_color_palette,

			init : function () {

				this.editor.on('setMode', lang.bind(function () {
					this.execCommand();
				}, this));

				this.$tools.find(".add-color").on('click', lang.bind(function () {
					this.addColor();
				}, this));

				this.$dialog.on('click', '.del-btn', lang.bind(function (e) { 
					this.deleteColor($(e.target).closest('.color-group'));
				}, this));

				program.ttfManager.on('set', lang.bind(function () {
					this.execCommand();
				}, this));

			},

            getTpl: function () {
                return tpl;
            },
			
			getTools : function () {
				var $dom = $('<a class="add-color"><i class="ico i-add"></i></a>');

				return $dom;
			},

			getFields : function () {
				var data = [];
				this.$content.find('.color-group').each(function (i, item) {
					var index = data.length;

					var r = +$(item).find('[data-field=r]').val();
					var g = +$(item).find('[data-field=g]').val();
					var b = +$(item).find('[data-field=b]').val();
					var a = +$(item).find('[data-field=a]').val();

					data[index] = { r : r, g : g, b : b, a : a};	
				});

				return data; 
			},

			addColor : function () {

				if (program.ttfManager)
				{
					var ttf = program.ttfManager.get();
					
					if (ttf.CPAL)
					{
						ttf.CPAL.colorRecords = ttf.CPAL.colorRecords || [];
					} else {
						ttf.CPAL = { colorRecords : []} 
					}

					ttf.CPAL.colorRecords.push({ r : 255, g : 255, b : 255, a : 255});

					program.ttfManager.fireChange(true);

					this.execCommand();
				}
			},

			deleteColor: function ($color) {
				$color.remove();

				var ttf = program.ttfManager.get();

				if (ttf.CPAL)
				{
					ttf.CPAL.colorRecords = this.getFields();

					program.ttfManager.fireChange(true);
				}


			},

            validate: function () {

                var setting = this.getFields();

                if (setting.leftSideBearing === undefined
                    && setting.rightSideBearing === undefined
                    && setting.unicode === undefined
                    && setting.name === undefined
                ) {
                    alert(i18n.lang.dialog_no_input);
                    return false;
                }

                return setting;
            },

			change : function (e) {

				var $parent = $(e.target).parent();

				var r = +$parent.find("[data-field=r]").val();
				var g = +$parent.find("[data-field=g]").val();
				var b = +$parent.find("[data-field=b]").val();
				var a = +$parent.find("[data-field=a]").val();

				$parent.find("label").css({
					'background-color' : 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (Math.round(a /255 * 100)/100) + ')'
				});
				

				var ttf = program.ttfManager.get();

				if (ttf.CPAL)
				{
					ttf.CPAL.colorRecords = this.getFields();

					program.ttfManager.fireChange(true);

				}
			},

			execCommand : lang.debounce(function (colorList) {

				// 선택된 폰트 정보를 가지고 온다. 
				if (program.ttfManager)
				{
					var ttf = program.ttfManager.get();

					if (ttf.CPAL)
					{
						this.updateTpl(ttf);

					}
				}

			}, this, 500)

        });
    }
);
