/**
 * @file glyf列表渲染器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var glyf2svg = require('fonteditor-core/ttf/util/glyf2svg');
        var string = require('common/string');
        var i18n = require('../../i18n/i18n');
        var GLYF_ITEM_TPL = ''   // glyf 템플릿 ( div 안에 svg 구조 ) 
            + '<div data-index="${index}" class="glyf-item ${jaso} ${compound} ${modify} ${selected} ${editing}">'
            +   '<i data-action="edit" class="ico i-edit" title="' + i18n.lang.edit + '"></i>'
            +   '<i data-action="del" class="ico i-del" title="' + i18n.lang.del + '"></i>'
            +   '<svg class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}">'
            +       '<g transform="scale(1, -1) translate(0, -${translateY}) scale(0.9, 0.9) ">'
            +           '<path class="path" ${fillColor} ${d}/></g>'
            +   '</svg>'
            +   '<div data-field="unicode" class="unicode" title="${unicode}">${unicode}</div>'
            +   '<div data-field="name" class="name" title="${name}" data-empty-name="${emptyName}">${name}</div>'
            + '</div>';

        var GLYF_ITEM_TPL_FOR_SVG = ''   // glyf 템플릿 ( div 안에 svg 구조 ) 
            + '<div data-index="${index}" class="glyf-item  ${jaso} ${compound} ${modify} ${selected} ${editing}">'
            +   '<i data-action="edit" class="ico i-edit" title="' + i18n.lang.edit + '"></i>'
            +   '<i data-action="del" class="ico i-del" title="' + i18n.lang.del + '"></i>'
            +   '<svg class="glyf">'
            +       '${svgDoc}'
            +   '</svg>'
            +   '<div data-field="unicode" class="unicode" title="${unicode}">${unicode}</div>'
            +   '<div data-field="name" class="name" title="${name}" data-empty-name="${emptyName}">${name}</div>'
            + '</div>';

		var getUnicodeString = function (unicode) {
			return '$' + unicode.toString(16).toUpperCase();
		}


        var glyfRender = {

            /**
             * 获取glyf渲染列表项目
             *
             * @param  {Object} glyf glyf结构
             * @param  {Object} ttf  ttf字体结构
             * @param  {Object} opt  渲染参数
             * @return {string}      glyf列表项目片段
             */
            render: function (glyf, ttf, opt) {

				var color = opt.color ? opt.color : '';
				var isColorLayer = false; 
				var isColorLayerIndex = opt.index; 
				var baseGlyphIndex = -1;
				var colorLayerIndex = -1; 

				// color 폰트 지원 
				if (ttf.COLR)	
				{	
					// color 를 가지고 있는 glyph 가 있다면 
					// color palette 에서 색깔을 가지고 와서 지정해준다. 
					var baseGlyphRecord = ttf.COLR.baseGlyphRecord || []; 

					for(var i = 0, len = baseGlyphRecord.length; i < len; i++) {
						var r = baseGlyphRecord[i];

						var hasGlyphLayer = false; 
						for (var index = r.firstLayerIndex; index < r.firstLayerIndex + r.numLayers; index++)
						{
							var layer = ttf.COLR.layerRecord[index];
							var colorPaletteIndex = layer.paletteIndex; 

							if (layer.glyphId == opt.index)
							{
								var c = ttf.CPAL.colorRecords[colorPaletteIndex];
								color = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + (Math.round((c.a/255) * 100)/100) + ")";
								hasGlyphLayer = true; 
								colorLayerIndex = index; 
								break;
							}
						}

						if (hasGlyphLayer)
						{
							baseGlyphIndex = r.glyphId; 
							isColorLayer = true; 
							break; 
						}
					}
					
				}

				// SVG 폰트 지원 
				var svgDoc = ''; 
				if (ttf.SVG && ttf.SVG.entries)
				{
					for(var i = 0, len = ttf.SVG.entries.length; i < len; i++) {
						var e = ttf.SVG.entries[i];

						if (e.startGlyphID <= opt.index && opt.index <= e.endGlyphID)
						{
							svgDoc = e.svgDoc;
							break; 
						}
					}

				}

				var unicode = (glyf.unicode || []).slice(0, 3).map(getUnicodeString).join(',');

				//  컬러 레이어인지 미리 판별해놓을까? 어디서 ? 
				if (isColorLayer)
				{
					var baseGlyf = ttf.glyf[baseGlyphIndex];

					unicode = baseGlyphIndex + " -> ";

					unicode += "["+colorLayerIndex+"]";
				}

				

                var g = {
                    index: opt.index,
					jaso : opt.jaso ? 'jaso' : '',
                    compound: glyf.compound ? 'compound' : '',
                    selected: opt.selected ? 'selected' : '',
                    editing: opt.editing ? 'editing' : '',
                    modify: glyf.modify,
                    unitsPerEm: opt.unitsPerEm,
                    translateY: opt.unitsPerEm + opt.descent,
                    unicode: unicode,
					emptyName : (glyf.unicode && glyf.unicode.length) ? String.fromCodePoint(glyf.unicode[0]) : '',
                    name: glyf.name,
					svgDoc: svgDoc,
                    fillColor: color ? 'style="fill:' + color + '"' : ''
                };


				if (svgDoc != '')
				{
					return string.format(GLYF_ITEM_TPL_FOR_SVG, g);
				} else {
					var d = '';
					if ((d = glyf2svg(glyf, ttf))) {
						g.d = 'd="' + d + '"';
					}
	                return string.format(GLYF_ITEM_TPL, g);
				}
            }
        };

        return glyfRender;
    }
);
