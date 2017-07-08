/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../../i18n/i18n');
        var lang = require('../../../common/lang');
        var string = require('fonteditor-core/ttf/util/string');
		var program = require('../program');

        return require('./setting').derive({

			id : 'innerdialog-setting-similar-glyf',

			width: '100%',
			height: 180,

            title: i18n.lang.dialog_similar_glyf,

			init : function () {
                // 여기서 UI 를 설정하고 
                // Glyf 선택이 변경됨에 따라  해당 하는 글리프와 유사한 리스트를 뿌려준다. 

			},

            validate: function () {

            },

			change : function () {
				//program.ttfManager.updateGlyf(setting, selected[0]);
			},

			execCommand : lang.debounce(function (command) {


			}, this, 500)

        });
    }
);
