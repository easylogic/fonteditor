/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../../i18n/i18n');
        var lang = require('../../../common/lang');
        var tpl = require('../../template/innerdialog/setting-glyf.tpl');
        var string = require('fonteditor-core/ttf/util/string');
        var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;
		var unicodeCheckReg = /[ㄱ-ㅎ가-힣]{1}/gi;
		var program = require('../program');

        return require('./setting').derive({

			id : 'innerdialog-setting-glyf',

			// style , rectangle 
//			right: 0,
//			bottom: 40,
			width: '100%',
			height: 180,

            title: i18n.lang.dialog_glyph_info,

			init : function () {
				// 이벤트 정의할게 있으면 여기다가 하자. 
				this.viewer.on('selection:change', lang.bind(function () {
					this.execCommand();
				}, this));

				this.editor.on('setMode', lang.bind(function () {
					this.execCommand();
				}, this));
			},

            getTpl: function () {
                return tpl;
            },

            validate: function () {

                var setting = this.getFields();

                if (setting.leftSideBearing === undefined
                    && setting.rightSideBearing === undefined
                    && setting.unicode === undefined
                    && setting.name === undefined
                ) {
                    alert(i18n.lang.dialog_no_input);
                    return false;
                }

                return setting;
            },

			change : function () {
				// 변경사항 적용하기 
				var setting = this.getFields();

				// 이름을 입력할 때 한글 유니코드 범위인 경우  자동으로 unicode 를 채워준다. 
				// TODO: 영문이나 기타 다른 문자도 적용해도 될 것 같다. 
				if (setting.name.length == 1)
				{
					if (setting.name.match(unicodeCheckReg))
					{
						var tempUnicode = setting.name.codePointAt();
						if (setting.unicode.indexOf(tempUnicode) == -1)
						{
							setting.unicode = [tempUnicode]; 

							this.update({
								unicode : setting.unicode
							});
							// 유니코드 바꾸고 다시 change 메소드를 실행해서 결과값을 전송한다. 

							this.change();

							return; 
						}
					}
				}

				this.options.glyfeditor.adjustFont(setting);

				//program.ttfManager.updateGlyf(setting, selected[0]);
			},

			execCommand : lang.debounce(function (command) {

				// 선택된 폰트 정보를 가지고 온다. 
				var fontInfo = this.editor.getFontInfo();
				this.update(fontInfo);

			}, this, 500)

        });
    }
);
