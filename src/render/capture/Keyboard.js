/**
 * @file 键盘捕获器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var lang = require('common/lang');
        var observable = require('common/observable');

        // 键盘名称映射表
        var keyCodeMap = {
			48 : 'NUM0',
			49 : 'NUM1',
			50 : 'NUM2',
			51 : 'NUM3',
			52 : 'NUM4',
			53 : 'NUM5',
			54 : 'NUM6',
			55 : 'NUM7',
			56 : 'NUM8',
			57 : 'NUM9',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            13: 'enter',
            27: 'esc',
            8: 'backspace',
            45: 'insert',
            46: 'delete',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            36: 'home',
            47: 'help',
            20: 'caps',
            9: 'tab',

			// alphabet 
			67 : 'C',
			71 : 'G',
			88 : 'X',
			89 : 'Y'
        };


        /**
         * 获取事件参数
         *
         * @param {MouseEvent} e 事件
         * @return {Object} 事件参数
         */
        function getEvent(e) {
            return {
                keyCode: e.keyCode,
                key: keyCodeMap[e.keyCode],
                ctrlKey: e.ctrlKey || e.metaKey,
                metaKey: e.metaKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                originEvent: e
            };
        }

        /**
         * 按下弹起事件
         * @param {Object} keyEventName 事件名称
         * @param {Object} e 事件参数
         */
        function keydetect(keyEventName, e) {

            if (false === this.events['key' + Event]) {
                return;
            }

            var event = getEvent(e);
            this.fire('key' + keyEventName, event);

            var keyName = keyCodeMap[event.keyCode];
            if (keyName) {
                this.fire(keyName + ':' + keyEventName, event);
            }
        }

        /**
         *  键盘动作捕获器
         *
         * @constructor
         * @param {HTMLElement} main 控制元素
         * @param {Object} options 参数选项
         * @param {HTMLElement} options.main 监控对象
         */
        function KeyboardCapture(main, options) {
            this.main = main;
            options = options || {};
            this.events = options.events || {};

            this.handlers = {
                keydown: lang.bind(keydetect, this, 'down'),
                keyup: lang.bind(keydetect, this, 'up'),
                keypress: lang.bind(keydetect, this, 'press')
            };

            this.start();
        }


        KeyboardCapture.prototype = {

            constructor: KeyboardCapture,

            /**
             * 开始监听
             *
             * @return {this}
             */
            start: function () {

                if (!this.listening) {
                    this.listening = true;

                    var target = document.body;
                    target.addEventListener('keydown', this.handlers.keydown, false);
                    target.addEventListener('keyup', this.handlers.keyup, false);
                    target.addEventListener('keypress', this.handlers.keypress, false);
                }

                return this;
            },

            /**
             * 停止监听
             *
             * @return {this}
             */
            stop: function () {

                if (this.listening) {
                    this.listening = false;

                    var target = document.body;
                    target.removeEventListener('keydown', this.handlers.keydown);
                    target.removeEventListener('keyup', this.handlers.keyup);
                    target.removeEventListener('keypress', this.handlers.keypress);
                }

                return this;
            },

            /**
             * 是否监听中
             *
             * @return {boolean} 是否
             */
            isListening: function () {
                return !!this.listening;
            },

            /**
             * 注销
             */
            dispose: function () {
                this.stop();
                this.main = this.events = null;
                this.un();
            }
        };

        observable.mixin(KeyboardCapture.prototype);

        return KeyboardCapture;
    }
);
