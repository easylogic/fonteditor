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

            var GLYF_ITEM_TPL  = ''   // glyf 아이템 템플릿 ( div 안에 svg 구조 ) 
			+ "<a class='glyf-item' "
			+ " data-action='addglyfshapes' data-glyf-index='${index}' title='${title}'>" 
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

                var $glyfList = $("<div class='glyf-list' />");

				this.$content.html($list);
                this.$content.append($glyfList);

				this.initEvent();
			},

            createGlyfList : function (font) {
                var list = [];
                
                var names = glyfGenerator.getSimilarGlyfName('KSC5601', font.name);

                var ttf = program.ttfManager.get();

                if (ttf) {
                    ttf.glyf.forEach(function(g, index) {

                        if (names.indexOf(g.name) > -1) {
                            list.push( { contours : g.contours, index : index });
                        }
                    });
                }

                // 이름으로 유추 
                // 자소이름일 경우 유사한 자소를 모두 표시한다. 
                // 예를 들어  k1-1-ㄱ 인 경우  k2-1-ㄱ  부터 죽 나열하고
                // 자음의 경우   초성과  종성을 나열하고 
                // 모음의 경우  위치에 따른 중성을 나열한다. 
                // ㅚ 같은 글자의 경우  ㅙ, ㅟ, ㅢ, 등의 정해진 글자를 나열한다. 


                // unicode 로 유추 


                return list; 
            },

            update : function ()  {
                // 현재 폰트 정보 얻어옴 
                var font = this.editor.getFontInfo();
                // unicode 및 name 정보로 유사한 glyf 유추 
                var glyfList = this.createGlyfList(font); 

                // glyf 리스트 화면에 출력 
                var arr = [];
				var self = this; 

				glyfList.forEach(function(g) {

					var unitsPerEm = getMax(g.contours);

					var obj = {
                        index : g.index,
						d : 'd="' + contours2svg(g.contours) + '"',
						unitsPerEm : unitsPerEm
					}
					arr.push(string.format(GLYF_ITEM_TPL, obj));
				});

                this.$content.find(".glyf-list").html(arr.join(''));

            },

			initEvent : function () {
				// 이벤트 정의할게 있으면 여기다가 하자. 
				this.viewer.on('selection:change', lang.bind(function () {
					this.update();
				}, this));

				this.$content.on('click', '[data-action="addsupportshapes"]', lang.bind(function (e) { 
					this.addShape($(e.target));
				}, this));

        		this.$content.on('click', '[data-action="addglyfshapes"]', lang.bind(function (e) { 
					this.addGlyfShape($(e.target));
				}, this));

			},

            getTpl: function () {
                return "";
            },

            addGlyfShape : function (target) {
                var index = target.attr('data-glyf-index');

                program.editor.execCommand('addglyfshapes', index);
            },

			addShape : function (target) {
				var type = target.attr('data-type');
				
				// 에디팅 상태랑 상관 없이 적용된다. 
				program.editor.execCommand('addsupportshapes', type);
			}

        });
    }
);
