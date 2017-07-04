/**
 * @file glyf列表相关命令
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var ei18n = require('editor/i18n/i18n');
        var i18n = require('../i18n/i18n');
        return [
			/*
            {
                name: 'setting-font',
                title: ei18n.lang.fontsetting,
                disabled: true
            }, */
			/*
            {
                name: 'setting-unicode',
                title: i18n.lang.setunicode
            },
			{
				type : 'split'
			}, */
			/*
            {
                name: 'find-glyf',
                title: i18n.lang.findglyf
            }*//*,
            {
                name: 'download-glyf',
                title: i18n.lang.downloadglyf
            },*/
/*			동기화 기능은 서비스에 맞겠끔 다시 설계하자. 
			,
            {
                name: 'setting-sync',
                title: i18n.lang.syncfont
            }
			*/
        ];
    }
);
