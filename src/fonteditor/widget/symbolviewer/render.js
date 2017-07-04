/**
 * Symbol renderer 
 *
 * @file glyf列表渲染器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var glyf2svg = require('fonteditor-core/ttf/util/contours2svg');
        var string = require('common/string');
        var i18n = require('../../i18n/i18n');
        var GLYF_ITEM_TPL = ''   // glyf 템플릿 ( div 안에 svg 구조 ) 
            + '<div data-index="${index}" class="glyf-item ${compound} ${modify} ${selected} ${editing}">'
            +   '<i data-action="add" class="ico i-edit" title="' + i18n.lang.add + '"></i>'
            +   '<i data-action="del" class="ico i-del" title="' + i18n.lang.del + '"></i>'
            +   '<svg class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}">'
            +       '<g transform="scale(1, -1) translate(0, -${translateY}) scale(0.9, 0.9) ">'
            +           '<path class="path" ${fillColor} ${d}/></g>'
            +   '</svg>'
            +   '<div data-field="name" class="name" title="${name}">${name}</div>'
            + '</div>';


        var symbolRender = {

            /**
             * 获取glyf渲染列表项目
             *
             * @param  {Object} glyf glyf结构
             * @param  {Object} ttf  ttf字体结构
             * @param  {Object} opt  渲染参数
             * @return {string}      glyf列表项目片段
             */
            render: function (glyf, ttf, opt) {
                var g = {
                    index: opt.index,
                    selected: opt.selected ? 'selected' : '',
                    unitsPerEm: opt.unitsPerEm,
                    translateY: opt.unitsPerEm + opt.descent,
                    name: glyf.name,
                    fillColor: opt.color ? 'style="fill:' + opt.color + '"' : ''
                };

                var d = '';
                if ((d = glyf2svg(glyf, ttf))) {
                    g.d = 'd="' + d + '"';
                }

                return string.format(GLYF_ITEM_TPL, g);
            }
        };

        return symbolRender;
    }
);
