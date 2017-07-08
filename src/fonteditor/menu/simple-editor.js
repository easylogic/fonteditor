/**
 * @file glyf编辑器相关命令
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var ei18n = require('editor/i18n/i18n');

        return [
			
            {
                name: 'save',
                title: ei18n.lang.save,
				ico : 'save',
                quickKey: 'S'
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
                name: 'addpath',
                title: ei18n.lang.addpath,
                ico: 'pencil'
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
				name: 'import-pic',
				text: ei18n.lang.import_pic_title,
				title: ei18n.lang.import_pic_title,
				ico: 'file-image',
				direction : 'right'
            }/*,

			{
				name: 'import-glyf',
				text: ei18n.lang.import_glyf_title,
				title: ei18n.lang.import_glyf_title,
				ico: 'copy',
				direction : 'right'
			}*/
        ];
    }
);
