/**
 * Symbol 관리 메뉴 
 *
 * @file glyf列表相关命令
 * @author easylogic(cyberuls@gmail.com)
 *
 */


define(
    function (require) {
        var ei18n = require('editor/i18n/i18n');
        var i18n = require('../i18n/i18n');
        return [
            {
                name: 'addsymbol',
                title: ei18n.lang.addsymbol
            },
            {
                type : 'split'
            },
            {
                name: 'delsymbol',
                title: ei18n.lang.delsymbol
            }
        ];
    }
);
