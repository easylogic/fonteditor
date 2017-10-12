/**
 * @file Implements Touch Event 
 * @author easylogic(cyberuls@gmail.com)
 */

define(

    function (require) {

        var lang = require('common/lang');
        var observable = require('common/observable');

        /**
         * TouchEvent X 좌표 
         *
         * @param {TouchEvent} e 
         * @return {number} 
         */
        function getX(e, touchIndex) {
            return e.changedTouches[touchIndex || 0].pageX;
        }

        /**
         * TouchEvent Y 좌표 
         *
         * @param {TouchEvent} e
         * @return {number} 
         */
        function getY(e, touchIndex) {
            return e.changedTouches[touchIndex || 0].pageY;
        }


        function getEvent(e) {
            var offset = $(e.target).offset(); 
            return {
                x: getX(e) - offset.left,
                y: getY(e) - offset.top,
                which: 1,   // [workround] touch event is equal to left mouse down event
                ctrlKey: e.ctrlKey || e.metaKey,
                metaKey: e.metaKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                isTouch: true, 
                originEvent: e
            };
        }


        function prevent(e) {
            e.stopPropagation();
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }
        }


        function touchstart(e) {

            if (false === this.events.touchstart) {
                return;
            }

            prevent(e);

            var event = getEvent(e);
            this.startX = event.x;
            this.startY = event.y;
            this.startTime = Date.now();
            this.isDown = true;

            // 左键

            this.fire('down', event);

            document.addEventListener('touchend', this.handlers.touchend, false);
        }

        /**
         * 双击事件
         *
         * @param {Object} e 事件参数
         */
        function hold(e) {

            prevent(e);

            if (false === this.events.hold) {
                return;
            }

            this.fire('dblclick', getEvent(e));
        }

        /**
         * 鼠标移动事件
         *
         * @param {Object} e 事件参数
         */
        function touchmove(e) {

            if (false === this.events.touchmove) {
                return;
            }

            prevent(e);

            var event = getEvent(e);

            this.fire('move', event);


            if (this.isDown && false !== this.events.drag) {

                event.startX = this.startX;
                event.startY = this.startY;
                event.deltaX = event.x - this.startX;
                event.deltaY = event.y - this.startY;

                if (
                    Math.abs(event.deltaX) >= this.dragDelta
                    || Math.abs(event.deltaY) >= this.dragDelta
                ) {
                    if (!this.isDragging) {
                        this.isDragging = true;
                        this.fire('dragstart', event);
                    }
                }

                if (this.isDragging) {                    
                    this.fire('drag', event);             
                }
            }
        }

        function touchend(e) {



            if (false === this.events.touchend) {
                return;
            }

            prevent(e);

            var event = getEvent(e);
            event.time = Date.now() - this.startTime;

            this.fire('up', event);

            /*
            if (3 === e.which) {
                this.fire('rightup', event);
            }
            */

            if (this.isDown && this.isDragging && false !== this.events.drag) {
                event.deltaX = event.x - this.startX;
                event.deltaY = event.y - this.startY;
                this.isDragging = false;
                this.fire('dragend', event);
            }
            else if (this.isDown && !this.isDragging && false !== this.events.touchstart) {
                this.isDragging = false;
                this.fire('click', event);
            }

            this.isDown = false;

            document.removeEventListener('touchend', this.handlers.touchend);
        }



        


        function TouchCapture(main, options) {

            this.main = main;
            options = options || {};
            this.events = options.events || {};
            this.dragDelta = 2;

			// 터치 관련된 마우스 이벤트를 바인딩하자. 
			// 다른 라이브러리를 써서 맞춰도 된다. 
            this.handlers = {
                touchmove: lang.bind(touchmove, this),
                touchstart: lang.bind(touchstart, this),
                hold: lang.bind(hold, this),
                touchend: lang.bind(touchend, this)
            };

            this.start();
        }


        TouchCapture.prototype = {

            constructor: TouchCapture,


            start: function () {

                if (!this.listening) {
                    this.listening = true;

                    var target = this.main;
                    target.addEventListener('touchmove', this.handlers.touchmove, false);
                    target.addEventListener('touchstart', this.handlers.touchstart, false);
                    target.addEventListener('hold', this.handlers.hold, false);
                    target.addEventListener('touchend', this.handlers.touchend, false);
                }

                return this;
            },

            stop: function () {

                if (this.listening) {
                    this.listening = false;

                    var target = this.main;
                    target.removeEventListener('touchmove', this.handlers.touchmove);
                    target.removeEventListener('touchstart', this.handlers.touchstart);
                    target.removeEventListener('hold', this.handlers.hold);
                    document.removeEventListener('touchend', this.handlers.touchend);
                }

                return this;
            },


            isListening: function () {
                return !!this.listening;
            },

            /**
             * 注销
             */
            dispose: function () {
                this.stop();
                this.un();
                this.main = this.events = null;
            }
        };


        observable.mixin(TouchCapture.prototype);
        return TouchCapture;
    }
);
