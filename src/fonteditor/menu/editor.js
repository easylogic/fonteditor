/**
 * @file glyf编辑器相关命令
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var ei18n = require('editor/i18n/i18n');

        return [
            {
                name: 'copyshapes',
                title: ei18n.lang.copy,
				ico : 'copy',
                quickKey: 'C',
                disabled: true
            },
            {
                name: 'cutshapes',
                title: ei18n.lang.cut,
				ico : 'cut',
                quickKey: 'X',
                disabled: true
            },
            {
                name: 'pasteshapes',
                title: ei18n.lang.paste,
                quickKey: 'V',
                disabled: true
            },
            {
                name: 'removeshapes',
                title: ei18n.lang.del,
				ico: 'trash',
                quickKey: 'D',
                disabled: true
            },
            {
                name: 'reversepoints',
                title: ei18n.lang.reversepoints,
				ico : 'reverse',
                quickKey: 'R',
                disabled: true
            },
            {
                name: 'save',
                title: ei18n.lang.save,
				ico : 'save',
                quickKey: 'S'
            },
            {
                type: 'split'
            },
            {
                name: 'rangemode',
                title: ei18n.lang.rangemode,
                ico: 'rangemode'
            },
            {
                name: 'pointmode',
                title: ei18n.lang.pointmode,
                ico: 'pointmode'
            },
            {
                name: 'addpath',
                title: ei18n.lang.addpath,
                ico: 'pencil'
            },
            {
                type: 'split'
            },
            {
                name: 'upshape',
                title: ei18n.lang.upshape,
                ico: 'upshape',
                disabled: true
            },
            {
                name: 'downshape',
                title: ei18n.lang.downshape,
                ico: 'downshape',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'horizontalalignshapes',
                title: ei18n.lang.alignleft,
                ico: 'alignleft',
                align: 'left',
                disabled: true
            },
            {
                name: 'horizontalalignshapes',
                title: ei18n.lang.aligncenter,
                ico: 'aligncenter',
                align: 'center',
                disabled: true
            },
            {
                name: 'horizontalalignshapes',
                title: ei18n.lang.alignright,
                ico: 'alignright',
                align: 'right',
                disabled: true
            },
            {
                name: 'verticalalignshapes',
                title: ei18n.lang.aligntop,
                ico: 'aligntop',
                align: 'ascent',
                disabled: true
            },
            {
                name: 'verticalalignshapes',
                title: ei18n.lang.alignmiddle,
                ico: 'alignmiddle',
                align: 'middle',
                disabled: true
            },
            {
                name: 'verticalalignshapes',
                title: ei18n.lang.aligndescent,
                ico: 'aligndescent',
                align: 'descent',
                disabled: true
            },
            {
                name: 'verticalalignshapes',
                title: ei18n.lang.alignbaseline,
                ico: 'alignbaseline',
                align: 'baseline',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'rotateleft',
                title: ei18n.lang.rotateleft,
                ico: 'rotateleft',
                disabled: true
            },
            {
                name: 'rotateright',
                title: ei18n.lang.rotateright,
                ico: 'rotateright',
                disabled: true
            },
            {
                name: 'flipshapes',
                title: ei18n.lang.flip,
                ico: 'flip',
                disabled: true
            },
            {
                name: 'mirrorshapes',
                title: ei18n.lang.mirror,
                ico: 'mirror',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'splitshapes',
                title: ei18n.lang.splitshapes,
                ico: 'splitshapes'
            },
            {
                name: 'joinshapes',
                title: ei18n.lang.joinshapes,
                ico: 'joinshapes',
                disabled: true
            },
            {
                name: 'intersectshapes',
                title: ei18n.lang.intersectshapes,
                ico: 'intersectshapes',
                disabled: true
            },
            {
                name: 'tangencyshapes',
                title: ei18n.lang.tangencyshapes,
                ico: 'tangencyshapes',
                disabled: true
            },
			{
                type: 'split'
            },
             {
                name: 'addpoint',
                title: ei18n.lang.addpoint,
				ico: 'addpoint',
                disabled: true
            },
            {
                name: 'removepoint',
                title: ei18n.lang.removepoint,
				ico: 'removepoint',
                disabled: true
            },
            {
                name: 'onCurve',
                title: ei18n.lang.oncurve,
				ico : 'oncurve',
                disabled: true
            },
            {
                name: 'offCurve',
                title: ei18n.lang.offcurve,
				ico : 'offcurve',
                disabled: true
            },
            {
                name: 'asStart',
                title: ei18n.lang.asstart,
                disabled: true
            }
        ];
    }
);
