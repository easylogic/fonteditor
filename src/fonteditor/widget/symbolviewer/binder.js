/**
 * @file symbolviewer的绑定相关函数
 * @author mengke01(kekee000@gmail.com)
 */



define(
    function (require) {
        var i18n = require('../../i18n/i18n');
        var lang = require('common/lang');
        var DragSelector = require('../DragSelector');
        var program = require('../program');

        function onItemClick(e) {

            var target = $(e.target);
            var action = target.attr('data-action');

            var selectedSymbol = target.parent('[data-index]');
            var selected = +selectedSymbol.attr('data-index');
            var lastEditing = this.getEditing();
            if (action === 'del') {
                if (!window.confirm(i18n.lang.msg_confirm_del_glyph)) {
                    return;
                }

                // 被选中的情况下需要移出
                selectedSymbol.remove();
                var selectedIndex = this.getSelected().indexOf(selected);
                if (selectedIndex >= 0) {
                    this.selectedList.splice(selectedIndex, 1);
                }

                if (selected === lastEditing) {
                    this.setEditing(-1);
                }
                this.fire('del', {
                    list: [selected]
                });
            }
            else if (action === 'add') {
                this.fire('add', {
                    list: [selected]
                });
            }
        }

        function onDragSelected(e) {
            var elements = e.items;
            var toggle = e.ctrl; // 是否toggle
            var append = e.shiftKey; // 是否append

            if (!toggle && !append) {
                this.main.children().removeClass('selected');
            }

            elements.forEach(function (element) {
                if (toggle) {
                    $(element).toggleClass('selected');
                }
                else {
                    $(element).addClass('selected');
                }
            });

            this.fire('selection:change');
        }

        function preventEvent(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function downlistener(e) {
            // 如果主程序停止监听key事件，则此处也不处理事件
            if (!program.listening) {
                return;
            }

            var me = this;
            e.ctrl = e.ctrl || e.metaKey;
            var selected;
            if (me.listening) {
                // 阻止ctrl+A默认事件
                // 전체 선택 
                if (65 === e.keyCode && e.ctrl) {
                    preventEvent(e);
                    me.main.children().addClass('selected');
                    me.fire('selection:change');
                }
                // 取消选中
                else if (27 === e.keyCode) {
                    e.stopPropagation();
                    me.clearSelected();
                    me.clearEditing();
                    me.fire('selection:change');
                }
                // del, cut
                else if (46 === e.keyCode) {
                    preventEvent(e);
                    selected = me.getSelected();
                    if (selected.length) {
                        // del, cut 取消选中的glyf
                        me.clearSelected();
                        // 正在编辑的
                        var editing = selected.indexOf(me.getEditing());
                        if (editing >= 0) {
                            me.clearEditing();
                        }

                        me.fire('selection:change');
                        me.fire('del', {
                            list: selected
                        });
                    }
                }
            }

        }

        /**
         * 绑定dom事件
         */
        function bindEvents() {

            var me = this;
            me.main.on('click', '[data-action]', lang.bind(onItemClick, this))  // data-action 클릭하기 
            .on('dblclick', '[data-index]', function (e) {  // data-index 더블클릭하기 
                e.ctrl = e.ctrlKey || e.metaKey;

                // double click 할 때 glyfeditor 로 추가해준다. 

                    var selected = $(this).attr('data-index');      // 더블클릭하면 편집모드로 변경 
                    me.fire('add', {
                        list: [selected]
                    });
            })
            .on('click', '[data-index]', function (e) {         // 현재 폰트 선택 , 클릭하기 
                e.ctrl = e.ctrlKey || e.metaKey;
                if (!e.target.getAttribute('data-action')) {
                    var selectedItems = null;
                    var element = this;
                    var the = $(element);

                    // 选中单个
                    if (!e.ctrl && !e.shiftKey) {       // ctrl 도 아니고 shift 도 아니여야 한다. 

                        // 선택 여부 변경 
                        selectedItems = me.main.find('.selected');
                        if (the.hasClass('selected') && selectedItems.length === 1 && selectedItems[0] === element) {
                            return;
                        }

                        selectedItems.removeClass('selected');
                        the.addClass('selected');
                        me.fire('selection:change');
                        return;
                    }

                    // 增加/减少选中
                    if (e.ctrl) {   // ctrl 누른채 선택하면 여러개 선택 할 수 있도록 변경  
                        the.toggleClass('selected');
                        me.fire('selection:change');
                        return;
                    }
                    // 选中多个
                    else if (e.shiftKey) {  // shift 누른채 선택하면 
                        selectedItems = Array.prototype.slice.call(me.main.find('.selected'));
                        the.addClass('selected');

                        if (!selectedItems.length) {
                            me.fire('selection:change');
                        }
                        else if (selectedItems.indexOf(element) === -1) {
                            var index = +element.getAttribute('data-index');
                            var nearest = null;
                            var distance = 0;
                            var minDistance = 0xFFFFFFFF;

                            selectedItems.forEach(function (item) {
                                distance = Math.abs(index - item.getAttribute('data-index'));
                                if (distance < minDistance) {
                                    nearest = item;
                                    minDistance = distance;
                                }
                            });

                            if (minDistance > 1) {
                                nearest = index < +nearest.getAttribute('data-index') ? element : nearest;
                                for (distance = 1; distance < minDistance; distance++) {
                                    $(nearest = nearest.nextElementSibling).addClass('selected');
                                }
                            }
                            me.fire('selection:change');
                        }
                    }
                }
            });

            me.downlistener = lang.bind(downlistener, this);
        }


        /**
         * 获取选中的glyfIndex
         *
         * 선택한 glyf 얻어오기 
         *
         * @return {Array} 选中的glyf列表
         */
        function getSelectedSymbol() {
            var selected = [];
            this.main.find('.selected').each(function (index, item) {
                selected.push(+item.getAttribute('data-index'));
            });
            return selected;
        }

        /**
         * 绑定命令菜单
         */
        function bindCommandMenu() {
            var commandMenu = this.commandMenu;

            var me = this;

            // 선택사항이 변경되었을 때 
            var delayFocus = lang.debounce(function () {
                me.focus();
            }, 20);

            commandMenu.on('command', function (e) {
                var command = e.command;
                var selected = me.getSelected();

                // 取消选中的glyf
                if (command === 'del') {
                    me.clearSelected();
                }

                me.fire(command, {
                    list: selected
                });

                // 这里延时进行focus
                delayFocus();
            });
        }

        return function () {

            bindEvents.call(this);

            this.dragSelector = new DragSelector(this.main, {
                onSelect: lang.bind(onDragSelected, this)
            });

            if (this.options.commandMenu) {
                this.commandMenu = this.options.commandMenu;
                delete this.options.commandMenu;
                bindCommandMenu.call(this);
            }
        };
    }
);
