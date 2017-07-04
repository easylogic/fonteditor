/**
 * @file 유니코드 삭제 팝업 
 * @author easylogic(cyberuls@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = require('../template/dialog/setting-reduce-glyf.tpl');

        return require('./setting').derive({

            title: i18n.lang.dialog_reduce_glyph,

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setFields(setting || {});
            },

            validate: function () {
                var setting = this.getFields();

                if (setting.reverse === undefined
                    && setting.mirror === undefined
                    && setting.scale === undefined
                    && setting.ajdustToEmBox === undefined
                ) {
                    alert(i18n.lang.dialog_no_input);
                    return false;
                }

                return setting;
            }

        });
    }
);
