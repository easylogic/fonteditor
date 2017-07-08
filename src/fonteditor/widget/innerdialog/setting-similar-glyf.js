/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../../i18n/i18n');
        var lang = require('../../../common/lang');
		var string = require('../../../common/string');
		var contours2svg = require('fonteditor-core/ttf/util/contours2svg');        
		var program = require('../program');
        var glyfGenerator = require('../../widget/glyf-generator');
		var unicodeType = require('../../widget/glyf-unicode-name');        

        var GLYF_ITEM_TPL  = ''   // glyf 아이템 템플릿 ( div 안에 svg 구조 ) 
        + "<a class='similar-glyf-item' "
        + " data-action='addglyfshapes' data-glyf-index='${index}'>" 
        +   '<svg  class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}">'
        +       '<g transform="scale(1, -1) translate(0, -${translateY}) scale(0.9, 0.9) ">'
        +           '<path class="path" ${fillColor} ${d}/>'
        +       '</g>'
        +   '</svg>'
        +   '<div data-field="unicode" class="unicode" title="${unicode}">${unicode}</div>'
        +   '<div data-field="name" class="name" title="${name}">${name}</div>'
        
        + "</a>";

        return require('./setting').derive({

			id : 'innerdialog-setting-similar-glyf',

			width: '100%',
			height: 180,

            title: i18n.lang.dialog_similar_glyf,

			init : function () {
                // 여기서 UI 를 설정하고 
                // Glyf 선택이 변경됨에 따라  해당 하는 글리프와 유사한 리스트를 뿌려준다. 
                this.viewer.on('selection:change', lang.bind(function () {
					this.execCommand();
				}, this));

                this.initEvent();
			},

            validate: function () {

            },

			change : function (glyfIndexList) {
				//program.ttfManager.updateGlyf(setting, selected[0]);
                var ttf = program.ttfManager.get();
                var unitsPerEm = ttf.head.unitsPerEm;
                var descent = ttf.hhea.descent;                

                var arr = [];
				glyfIndexList.forEach(function(index) {
                    var symbol = ttf.glyf[index];
					var obj = {
                        index: index,
						name : symbol.name,
						unicode : symbol.unicode.join(','),
						d : 'd="' + contours2svg(symbol.contours) + '"',
						unitsPerEm : unitsPerEm,
                        translateY : unitsPerEm + descent
					}
					arr.push(string.format(GLYF_ITEM_TPL, obj));
				});

				var $list = $("<div class='similar-glyf-list' />");
				$list.html(arr.join(''));

				this.$content.html($list);
			},


			initEvent : function () {
				// 이벤트 정의할게 있으면 여기다가 하자. 

				this.$content.on('click', '[data-action="addglyfshapes"]', lang.bind(function (e) { 
					this.addGlyfShape($(e.target));
				}, this));

			},
            
            addGlyfShape : function (target) {
                var index = +target.attr('data-glyf-index');

                var ttf = program.ttfManager.get();
                if (ttf.glyf[index]) {
                    program.editor.execCommand('addcontours', ttf.glyf[index].contours, {
                        selected: true
                    });
                }

            },

			execCommand : lang.debounce(function (command) {
                    var fontInfo = this.editor.getFontInfo();

                    if (fontInfo && fontInfo.name) {
                        var list = glyfGenerator.getSimilarGlyfName(unicodeType.KSC5601, fontInfo.name);

                        var glyfIndexList = program.ttfManager.findGlyf({
                            filter : function (glyf) {
                                return list.indexOf(glyf.name) > -1 && glyf.name != fontInfo.name;
                            }
                        });

                        this.change(glyfIndexList);

                    }
			}, this, 500)

        });
    }
);
