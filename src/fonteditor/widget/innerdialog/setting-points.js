/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../../i18n/i18n');
        var lang = require('../../../common/lang');
        var tpl = require('../../template/innerdialog/setting-points.tpl');
        var string = require('fonteditor-core/ttf/util/string');
		var program = require('../program');

        return require('./setting').derive({

			id : 'innerdialog-setting-points',

//			right: 0,
//			top: 40,
			width: '100%',
			height: 150,

            title: i18n.lang.dialog_points_info,

			init : function () {


				// 이벤트 정의할게 있으면 여기다가 하자. 
				this.viewer.on('selection:change', lang.bind(function () {
					this.execCommand();
				}, this));

				this.editor.on('change', lang.bind(function () {
					this.execCommand();
				}, this));

				this.editor.on('setMode', lang.bind(function () {
					this.execCommand();
				}, this));

				this.editor.on('selection:change', lang.bind(function () {
					this.execCommand();
				}, this));

				this.editor.on('refreshPoint', lang.bind(function () {
					this.execCommand();
				}, this));

				this.$dialog.on('click', '.del-btn', lang.bind(function (e) { 
					this.deletePoint($(e.target).closest('.point-group'));
				}, this));

			},

            getTpl: function () {
                return tpl;
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

			deletePoint : function ($p) {
				var index = +$p.data('index');
				
				this.editor.removePoint(index);

				this.execCommand();
			},

			getFields : function () {
				var data = [];
				this.$content.find('.point-group').each(function (i, item) {
					var index = data.length;

					var x = +$(item).find('[data-field=x]').val();
					var y = +$(item).find('[data-field=y]').val();
					var onCurve = !!$(item).find('[data-field=onCurve]:checked').length;
					
					data[index] = { x : x, y : y, onCurve: onCurve };	

					if ($(item).hasClass('current'))
					{
						data[index].current = true; 
					}
				});

				return data; 
			},

			change : function (isReplace) {
				// 변경사항 적용하기 
				var points = this.getFields();

				this.editor.resetPoints(this.editor.getReversePoints(points), isReplace);
			},

			execCommand : lang.debounce(function (command) {

				if (this.editor.curShape || this.editor.currentGroup)
				{
					var shape = this.editor.currentGroup ? this.editor.currentGroup.shapes[0] : this.editor.curShape;

					if (!shape)
					{
						return; 
					}

					// 그리기 좌표가 아니라 실제 폰트 좌표를 얻어온다. 
					var	points = this.editor.getPoints(shape.points );

					if (this.editor.curPoint)
					{
						if (points[this.editor.curPoint.pointId])
						{
							points[this.editor.curPoint.pointId].current = true; 
						}

					}

					if (this.editor.curPoints)
					{
						this.editor.curPoints.forEach(function(cur) {
							if (points[cur.pointId])
							{
								points[cur.pointId].current = true; 
							}

						});
					}

					this.updateTpl({ points : points });

					if (this.editor.curPoint)
					{
						var $items = this.$content.find("[data-index="+this.editor.curPoint.pointId+"]");
						if ($items.length)
						{
							$items[0].scrollIntoView();
						}

					}

				}

			}, this, 500)

        });
    }
);
