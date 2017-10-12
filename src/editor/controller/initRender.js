/**
 * @file Editor 的render初始化
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var commandList = require('../menu/commandList');
        var lang = require('common/lang');
        var modeSupport = require('../mode/support');
        var selectShape = require('render/util/selectShape');


        function onContextMenu(e) {
            this.contextMenu.hide();
            switch (e.command) {
                case 'addreferenceline':
                    this.execCommand('addreferenceline', e.pos.x, e.pos.y);
                    break;
                case 'split':
                    this.setMode('split');
                    break;
                case 'paste':
                    var shapes = this.getClipBoard();
                    if (shapes) {
                        this.execCommand('pasteshapes', shapes, e.pos);
                    }
                    break;
                case 'addsupportshapes':
                    this.execCommand('addsupportshapes', e.args.type);
                    break;
                case 'gridsorption':
                    this.execCommand('gridsorption', !e.args.selected);
                    break;
                case 'shapesorption':
                    this.execCommand('shapesorption', !e.args.selected);
                    break;
                case 'showgrid':
                    this.execCommand('showgrid', !e.args.selected);
                    break;
                case 'save':
                    this.fire('save');
                    break;
                default:
                    this.execCommand(e.command);
            }
        }

        function setCamera(render, e) {
            render.camera.x = e.x;
            render.camera.y = e.y;
            render.camera.event = e;
        }

        function initCaptureEvent (capture, render) {
            var me = this; 

            capture.on('down', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                render.camera.startX = e.x;
                render.camera.startY = e.y;
                setCamera(render, e);

                me.mode.down && me.mode.down.call(me, e);
            });

            capture.on('dragstart', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }
                setCamera(render, e);
                me.mode.dragstart && me.mode.dragstart.call(me, e);
            });

            capture.on('drag', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                render.camera.mx = e.x - render.camera.x;
                render.camera.my = e.y - render.camera.y;
                setCamera(render, e);

                me.mode.drag && me.mode.drag.call(me, e);
            });

            capture.on('dragend', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }
                setCamera(render, e);

                me.mode.dragend && me.mode.dragend.call(me, e);
            });

            capture.on('move', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                // 这里由于canvas绘制导致0.5像素偏差，需要修正一下
                //me.graduationMarker.moveTo(e.x - 1, e.y - 1);
                me.mode.move && me.mode.move.call(me, e);
            });

            capture.on('up', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                me.mode.up && me.mode.up.call(me, e);
            });

            capture.on('click', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                me.mode.click && me.mode.click.call(me, e);
            });


            capture.on('dblclick', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                var result = render.getLayer('font').getShapeIn(e);
                if (result) {
                    var shape = selectShape(result, e);
                    me.setMode('point', shape);
                }
                else if (me.mode === modeSupport.point) {
                    me.setMode();
                }
            });

            capture.on('rightdown', function (e) {

                if (me.mode.rightdown) {
                    me.mode.rightdown.call(me, e);
                }
                else {
                    me.contextMenu.onClick = lang.bind(onContextMenu, me);
                    me.contextMenu.show(e, commandList.editor);
                }
            });
        }

        function initKeyboardEvent (capture, render) {
            var me = this; 
            capture.on('keyup', function (e) {
                if (me.contextMenu.visible()) {
                    return;
                }
                // esc键，重置model
                if (e.key === 'esc' && !me.mode.keyup) {
                    me.setMode();
                } else if (e.key == 'G' && !me.mode.keyup) {	// show grid 토글 
					me.execCommand('showgrid', !me.options.axis.showGrid);
                } else if (e.key == 'Y' && !me.mode.keyup) {	// outline 토글
					me.execCommand('showoutline', !me.options.fontLayer.fill);
                } else {
                    me.mode.keyup && me.mode.keyup.call(me, e);
                }
            });

            capture.on('keydown', function (e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                // 保存
                if (e.keyCode === 83 && e.ctrlKey) {
                    me.fire('save');
                }
                // 粘贴
                else if (e.keyCode === 86 && e.ctrlKey) {
                    var shapes = me.getClipBoard();
                    if (shapes) {
                        me.execCommand('pasteshapes', shapes);
                    }
                }
                // 放大  (ctrl + plus = 확대) 
                else if (e.keyCode === 187 && (e.ctrlKey || e.altKey)) {
                    e.originEvent.stopPropagation();
                    e.originEvent.preventDefault();
                    me.execCommand('enlargeview')
                }
                // 缩小 ( alt + minus = 축소)  이상함 ,  ctrl  은 왜 동작을 안하지 
                else if (e.keyCode === 189 && (e.ctrlKey || e.altKey)) {
                    e.originEvent.stopPropagation();
                    e.originEvent.preventDefault();
                    me.execCommand('narrowview')
                }
                // 撤销
                else if (e.keyCode === 90 && e.ctrlKey) {
                    if (me.mode.undo) {
                        me.mode.undo.call(me, e);
                    }
                    else {
                        me.execCommand('undo');
                    }
                }
                // 恢复
                else if (e.keyCode === 89 && e.ctrlKey) {
                    if (me.mode.redo) {
                        me.mode.redo.call(me, e);
                    }
                    else {
                        me.execCommand('redo');
                    }
                }

                else {
                    me.mode.keydown && me.mode.keydown.call(me, e);
                }
            });


            capture.on('keydown', function (e) {
                if (me.contextMenu.visible()) {
                    return;
                }

                me.mode.keydown && me.mode.keydown.call(me, e);
            });

        }

        /**
         * 初始化渲染器
         */
        function initRender() {
            var me = this;
            var render = this.render;

            var setCamera = function (e) {
                render.camera.x = e.x;
                render.camera.y = e.y;
                render.camera.event = e;
            };

            // init mouse event 
            initCaptureEvent.call(this, render.capture, render);

            // init touch event 
            initCaptureEvent.call(this, render.touchCapture, render);

            // init keyboard event 
            initKeyboardEvent.call(this, render.keyCapture, render);


            render.on('resize', function (e) {
                me.render.move(
                    (e.size.width - e.prevSize.width) / 2,
                    (e.size.height - e.prevSize.height) / 2
                );
                me.render.refresh();
            });
        }

        return initRender;
    }
);
