/**
 * @file 弹出框基类，用来生成相关的设置对话框
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var string = require('common/string');
        var i18n = require('../i18n/i18n');
        var lang = require('common/lang');
        var pad = require('common/string').pad;
        var program = require('../widget/program');

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
        function InnerDialog(options) {

            this.options = options || {};

			var dialog = this.getDialog();

			dialog.on('change, input', 'input', lang.bind(function () {
				this.change();
			}, this));
           
        }


		// 설정값이 변경이 되면 무조건 반응 
		InnerDialog.prototype.change = function () {
			var setting = this.validate();
			if (false !== setting) {
				this.options.onChange && this.options.onChange.call(this, setting);
			}
		};


        /**
         * 获取模板
         *
         * @return {string} 模板字符串
         */
        InnerDialog.prototype.getTpl = function () {
            return '';
        };

        /**
         * 获取dialog对象
         *
         * @return {Object} dialog对象
         */
        InnerDialog.prototype.getDialog = function () {
            return $('#model-dialog');
        };

        /**
         * 验证设置
         *
         * @return {boolean}
         */
        InnerDialog.prototype.validate = function () {
            return true;
        };


        /**
         * 设置field字段值
         *
         * @param {Object} setting 原始对象
         * @return {boolean}
         */
        InnerDialog.prototype.setFields = function (setting) {
            this.getDialog().find('[data-field]').each(function (i, item) {

                var field = item.getAttribute('data-field');
                var type = item.getAttribute('data-type') || item.type;
                var val = getValue(setting, field);
                if (undefined === val) {
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

            this.oldInnerDialog = setting;

            return this;
        };

        /**
         * 获取field字段值
         *
         * @param {Object} setting 原始对象
         * @return {Object}
         */
        InnerDialog.prototype.getFields = function (setting) {
            setting = setting || {};
            var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

            this.getDialog().find('[data-field]').each(function (i, item) {

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

        /**
         * 显示
         *
         * @param {Object} setting 设置选项
         * @return {this}
         */
        InnerDialog.prototype.show = function (setting) {
            program.listening = false;
            var dlg = $('#model-dialog');
            if (this.style) {
                dlg.addClass(this.style);
            }
            dlg.modal('show');
            this.set(setting);
            return this;
        };

        InnerDialog.prototype.update = function (setting) {
            this.set(setting);
            return this;
        };

        /**
         * 关闭选项卡
         * @param {?Object} setting 设置选项
         */
        InnerDialog.prototype.hide = function (setting) {
            if (undefined !== setting) {
                this.options.onChange && this.options.onChange.call(this, setting);
            }

            //$('#model-dialog').modal('hide');
        };


        /**
         * 设置设置选项
         * @param {Object} setting 设置选项
         * @return {this}
         */
        InnerDialog.prototype.set = function (setting) {
            this.setting = setting;
            return this;
        };

        /**
         * 获取设置选项
         *
         * @return {Object} 设置选项
         */
        InnerDialog.prototype.get = function () {
            return this.setting;
        };

        /**
         * 언제나 떠있음. 사라지지 않음 
         */
        InnerDialog.prototype.dispose = function () {
            //$('#model-dialog').modal('hide');
        };

        /**
         * 派生一个setting
         *
         * @param {Object} proto 原型函数
         * @return {Function} 派生类
         */
        InnerDialog.derive = function (proto) {

            function SubInnerDialog() {
                InnerDialog.apply(this, arguments);
            }

            SubInnerDialog.prototype = proto;
            lang.inherits(SubInnerDialog, InnerDialog);
            return SubInnerDialog;
        };

        return InnerDialog;
    }
);
