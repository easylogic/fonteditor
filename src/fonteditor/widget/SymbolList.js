/**
 * @file 命令菜单栏
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
		var lang = require('common/lang');
        var i18n = require('../i18n/i18n');
		var contours2svg = require('fonteditor-core/ttf/util/contours2svg');
        var observable = require('common/observable');
		var string = require('common/string');
		var shapes = require('editor/shapes/support');

		 var SYMBOL_ITEM_TPL  = ''   // symbol 아이템 템플릿 ( div 안에 svg 구조 ) 
			+ "<a class='symbol-item btn btn-flat btn-sm' "
			+ " data-action='addsupportshapes' data-type='${symbol}' title='${title}'>" 
            +   '<svg viewbox="0 0 ${unitsPerEm.xMax} ${unitsPerEm.yMax}">'
            +       '<g><path class="path" ${fillColor} ${d}/></g>'
            +   '</svg>'
			+ "</a>";

        function SymbolList(main, options) {

            this.main = $(main);
			this.options = lang.extend({ }, options);
           
			this.init();
        }

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

		SymbolList.prototype.init = function () {
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

			this.main.html(arr.join(''));
		}

        observable.mixin(SymbolList.prototype);

        return SymbolList;
    }
);
