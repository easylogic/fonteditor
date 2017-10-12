/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

		var lang = require('../../../common/lang');
        var i18n = require('../../i18n/i18n');
		var contours2svg = require('fonteditor-core/ttf/util/contours2svg');
		var string = require('../../../common/string');
		var shapes = require('../../../editor/shapes/support');
		var program = require('../program');
        var glyfGenerator = require('../glyf-generator');

		 var SYMBOL_ITEM_TPL  = ''   // symbol 아이템 템플릿 ( div 안에 svg 구조 ) 
			+ "<a class='symbol-item' "
			+ " data-action='addsupportshapes' data-type='${symbol}' title='${title}'>" 
            +   '<svg viewbox="0 0 ${unitsPerEm.xMax} ${unitsPerEm.yMax}">'
            +       '<g><path class="path" ${fillColor} ${d}/></g>'
            +   '</svg>'
			+ "</a>";


		function getMax (contours) {
			var xMax = 0; 
			var yMax = 0; 

			contours.forEach(function(c) {
				c.forEach(function(p) {
					if (p.x > xMax) { xMax = p.x; }
					if (p.y > yMax) { yMax = p.y; }
				})
			});

			return { xMax : xMax, yMax : yMax };
		}

		

        return require('./setting').derive({

			id : 'innerdialog-setting-shape-maker',

//			right: 0,
//			top: 350,
			width: '100%',
			height: 150,

            title: i18n.lang.dialog_shape_info,

			init : function () {
				var arr = [];
				var self = this; 

				var symbols = Object.keys(shapes);

				symbols.forEach(function(symbol) {

					var unitsPerEm = getMax(shapes[symbol]);

					var obj = {
						symbol : symbol,
						title : i18n.lang[symbol],
						d : 'd="' + contours2svg(shapes[symbol]) + '"',
						unitsPerEm : unitsPerEm
					}
					arr.push(string.format(SYMBOL_ITEM_TPL, obj));
				});

				var $list = $("<div class='symbol-list' />");
				$list.html(arr.join(''));

                var $glyfList = $("<div class='other-glyf-list' />");

				this.$content.html($list);
                this.$content.append($glyfList);

				this.initEvent();
			},

			initEvent : function () {
				// 이벤트 정의할게 있으면 여기다가 하자. 

				this.$content.on('click, touchend', '[data-action="addsupportshapes"]', lang.bind(function (e) { 
					console.log(e.target);
					this.addShape($(e.target));
				}, this));

			},

            getTpl: function () {
                return "";
            },

			addShape : function (target) {
				var type = target.attr('data-type');
				
				// 에디팅 상태랑 상관 없이 적용된다. 
				program.editor.execCommand('addsupportshapes', type);
			}

        });
    }
);
