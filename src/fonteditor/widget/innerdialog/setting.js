/**
 * @file 弹出框基类，用来生成相关的设置对话框
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var string = require('common/string');
        var i18n = require('../../i18n/i18n');
        var lang = require('common/lang');
        var pad = require('common/string').pad;
		var program = require('../program');
		var utpl = require('utpl');

        /**
         * 获取对象的值
         *
         * @param {Object} object 对象
         * @param {string} path 对象路径
         * @return {*} 对象的值
         */
        function getValue(object, path) {
            var ref = path.split('.');

            if (ref.length === 1) {
                return object[path];
            }

            var refObject = object;
            var property;

            while (refObject != null && (property = ref.shift())) {
                refObject = refObject[property];
            }

            return refObject;
        }

        /**
         * 设置对象的值
         *
         * @param {Object} object 对象
         * @param {string} path path
         * @param {*} value 值
         * @return {Object} 对象
         */
        function setValue(object, path, value) {
            var ref = path.split('.');

            if (ref.length === 1) {
                object[path] = value;
            }
            else {
                var lastProperty = ref.pop();
                var refObject = object;
                var property;

                while (refObject != null && (property = ref.shift())) {
                    refObject = refObject[property];
                }

                if (refObject != null) {
                    refObject[lastProperty] = value;
                }
            }

            return object;
        }


        /**
         * 设置框函数
         *
         * @param {Object} options 参数选项
         * @constructor
         */
        function Setting(options) {

            this.options = options || {};
		
			this.$dialog = this.getDialog();

			var me = this; 
			var style = {};
			/*
			['left', 'right', 'top', 'bottom'].forEach(function(pos) {
				if (typeof me[pos] !== 'undefined') { style[pos] = me[pos]; }
			}); */

			this.$dialog.css(style);

			this.$title = this.$dialog.find("> .title");
			this.$tools = this.$dialog.find("> .tools");
			this.$content = this.$dialog.find("> .content");

			this.$title.html(this.title);
			this.$tools.html(this.getTools());
			
			this.$dialog.width(this.width || 200);
			this.$dialog.height(this.height || 300);

            var tpl = string.format(this.getTpl(), i18n);
			this.tpl = utpl.template(tpl);

			this.updateTpl();
		
			this.$content.on('input', 'input', lang.bind(function (e) {
				this.change(e);
			}, this));

			this.$content.on('click', 'input[type=checkbox]', lang.bind(function () {
				this.change();
			}, this));

			this.viewer = program.viewer;
			this.glyfeditor = this.options.glyfeditor;
			$(".main").append(this.$dialog);

			this.editor = this.glyfeditor.editor;

			this.init();

        }

		/**
		 * 변경사항 적용 하기 
		 * 
		 * dialog 마다 다르게 적용하자. 
		 * 재정의하세요. 
		 *
		 */
        Setting.prototype.change = function () {

        };


		/**
		 * 외부 명령어 실행하기 
		 *
		 *
		 */
		Setting.prototype.execCommand = function (command) {
			//command 에 따라서 다르게 구분지어서 해보자. 
		};


        /**
         * 获取模板
         *
         * @return {string} 模板字符串
         */
        Setting.prototype.getTpl = function () {
            return '';
        };

		Setting.prototype.getTools = function () {
			return '';
		}

        /**
         * 获取dialog对象
         *
         * @return {Object} dialog对象
         */
        Setting.prototype.getDialog = function () {
            var $dialog = $("<div id='"+this.id+"' class='innerdialog' />");

			$dialog.append("<div class='title'></div>");
			$dialog.append("<div class='tools'></div>");
			$dialog.append("<div class='content'></div>");

			return $dialog;
        };

        /**
         * 验证设置
         *
         * @return {boolean}
         */
        Setting.prototype.validate = function () {
            return true;
        };


        /**
         * 设置field字段值
         *
         * @param {Object} setting 原始对象
         * @return {boolean}
         */
        Setting.prototype.setFields = function (setting) {
            this.$content.find('[data-field]').each(function (i, item) {

                var field = item.getAttribute('data-field');
                var type = item.getAttribute('data-type') || item.type;
                var val = getValue(setting, field);

                if (undefined === val) {
                    return;
                }

				if (val == NaN)
				{
					return;
				}

                if (type === 'checkbox') {
                    item.checked = val ? 'checked' : '';
                }
                else if (type === 'unicode') {
                    item.value = (val || []).map(function (u) {
                        return '$' + u.toString(16).toUpperCase();
                    }).join(',');
                }
                else if (type === 'datetime-local') {
                    var date;
                    if (typeof val === 'string') {
                        date = new Date(Date.parse(val));
                    }
                    else if (/^\d+$/.test(val)) {
                        date = new Date(+val);
                    }
                    else {
                        date = val;
                    }
                    item.value = date.getFullYear()
                        + '-' + pad(date.getMonth() + 1, 2)
                        + '-' + pad(date.getDate(), 2)
                        + 'T' + pad(date.getHours(), 2)
                        + ':' + pad(date.getMinutes(), 2);
                }
                else {
                    item = $(item);
                    item.val(val);
                }

            });

            this.set(setting);

            return this;
        };

        /**
         * 获取field字段值
         *
         * @param {Object} setting 原始对象
         * @return {Object}
         */
        Setting.prototype.getFields = function (setting) {
            setting = setting || {};
            var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

            this.$content.find('[data-field]').each(function (i, item) {

                var field = item.getAttribute('data-field');
                var type = item.getAttribute('data-type') || item.type;
                var originValue = item.value.trim();
                var val;

                if (type === 'checkbox') {
                    val = !!item.checked;
                }
                else if (type === 'unicode') {
                    if (!originValue) {
                        val = [];
                    }
                    else if (unicodeREG.test(originValue)) {
                        val = originValue.split(',').map(function (u) {
                            return Number('0x' + u.slice(1));
                        });
                    }
                    else {
                        val = originValue.split('').map(function (u) {
                            return u.charCodeAt(0);
                        });
                    }
                }
                else if (type === 'datetime-local') {
                    if (originValue) {
                        val = Date.parse(originValue.replace('T', ' '));
                    }
                    else {
                        val = 0;
                    }
                }
                else if (type === 'number') {
                    if (originValue) {
                        originValue = +originValue;
                        if (item.getAttribute('data-ceil')) {
                            originValue = Math.floor(originValue);
                        }
                        val = originValue;
                    }
                    else {
                        val = null;
                    }
                }
                else {
                    val =  originValue;
                }

                if (undefined !== val) {
                    setValue(setting, field, val);
                }
            });

            return setting;
        };

		Setting.prototype.updateTpl = function (data) {
			this.$content.html(this.tpl(
				lang.overwrite({ 
					title : this.title
				}, data)
			))
		}

		Setting.prototype.update = function (setting) {
			this.setFields(setting);
			return this; 
		}

        /**
         * 设置设置选项
         * @param {Object} setting 设置选项
         * @return {this}
         */
        Setting.prototype.set = function (setting) {
            this.setting = setting;
            return this;
        };

        /**
         * 获取设置选项
         *
         * @return {Object} 设置选项
         */
        Setting.prototype.get = function () {
            return this.setting;
        };

        /**
         * 派生一个setting
         *
         * @param {Object} proto 原型函数
         * @return {Function} 派生类
         */
        Setting.derive = function (proto) {

            function SubSetting() {
                Setting.apply(this, arguments);
            }

            SubSetting.prototype = proto;
            lang.inherits(SubSetting, Setting);
            return SubSetting;
        };

        return Setting;
    }
);
