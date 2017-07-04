/**
 * @file glyfviewer的绑定相关函数
 * @author mengke01(kekee000@gmail.com)
 */



define(
    function (require) {
        var i18n = require('../../i18n/i18n');
        var lang = require('common/lang');
        var DragSelector = require('../DragSelector');
        var program = require('../program');
		var actions = require('../../controller/actions');

        function onItemClick(e) {

            var target = $(e.target);
            var action = target.attr('data-action');

            var selectedGlyf = target.parent('[data-index]');
            var selected = +selectedGlyf.attr('data-index');
            var lastEditing = this.getEditing();
            if (action === 'del') {
                if (!window.confirm(i18n.lang.msg_confirm_del_glyph)) {
                    return;
                }

                // 被选中的情况下需要移出
                selectedGlyf.remove();
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
            else if (action === 'edit') {
                this.fire('edit', {
                    lastEditing: lastEditing,
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
                if (65 === e.keyCode && e.ctrl) {
                    preventEvent(e);
                    me.main.children().addClass('selected');
                    me.fire('selection:change');
                }
                // 撤销
                else if (90 === e.keyCode && e.ctrl) {
                    preventEvent(e);
                    me.fire('undo');
                }
                // 重做
                else if (89 === e.keyCode && e.ctrl) {
                    preventEvent(e);
                    me.fire('redo');
                }
                // 取消选中
                else if (27 === e.keyCode) {
                    e.stopPropagation();
                    me.clearSelected();
                    me.clearEditing();
                    me.fire('selection:change');
                }
                // 左移
                else if (37 === e.keyCode) {		// 왼쪽 
                    me.fire('moveleft');
                }
                // 右移
                else if (39 === e.keyCode) {		// 오른쪽 
                    me.fire('moveright');
                }
                // del, cut
                else if (46 === e.keyCode || (88 === e.keyCode && e.ctrl)) {
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
                        me.fire(46 === e.keyCode ? 'del' : 'cut', {
                            list: selected
                        });
                    }
                }
                // copy
                else if (67 === e.keyCode && e.ctrl) {
                    preventEvent(e);
                    selected = me.getSelected();
                    if (selected.length) {
                        me.fire('copy', {
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

			// 선택사항이 변경되었을 때 
            me.on('selection:change', lang.debounce(function () {
                var selected = getSelectedGlyf.call(me);
                me.selectedList = selected;
            }, 100));

            me.main.on('click', '[data-action]', lang.bind(onItemClick, this))  // data-action 클릭하기 
            .on('dblclick', '[data-index]', function (e) {  // data-index 더블클릭하기 
                e.ctrl = e.ctrlKey || e.metaKey;
                if (!e.ctrl && !e.shiftKey && !e.target.getAttribute('data-action') /*&& me.mode === 'list'*/) {
                    var selected = $(this).attr('data-index');      // 더블클릭하면 편집모드로 변경 
                    me.fire('edit', {
                        lastEditing: me.getEditing(),
                        list: [selected]
                    });
                }
            })
            .on('click', '[data-index]', function (e) {         // 현재 폰트 선택 , 클릭하기 
                e.ctrl = e.ctrlKey || e.metaKey;
                if (!e.target.getAttribute('data-action')) {
                    var selectedItems = null;
                    var element = this;
                    var the = $(element);

                    // 选中单个
                    if (!e.ctrl && !e.shiftKey) {       // ctrl 도 아니고 shift 도 아니여야 한다. 
                        /*if (me.mode === 'editor') { // editor 모드일 때는 바로 editing 으로 전환 */
                            var selected = the.attr('data-index');

                            me.fire('edit', {
                                lastEditing: me.getEditing(),
                                list: [selected]
                            });
                        /*}*/

                        // 선택 여부 변경 
                        selectedItems = me.main.find('.selected');

                        if (the.hasClass('selected') && selectedItems.length === 1 && selectedItems[0] === element) {
                            return;
                        }

                        selectedItems.removeClass('selected');
                        the.addClass('selected');
                        me.fire('selection:change');

						// 한글 범위이면 자소를 편집할 수 있도록 자소 리스트를 보여준다. 
						var ttf = program.ttfManager.get();
						var font = ttf.glyf[selected];
						if (0xAC00 <= font.unicode[0] && font.unicode[0] <= 0xD7A3)
						{
							var jaso_list = actions.splitJaso(font.unicode);
							me.hideJasoList();
							me.showJasoList(ttf, jaso_list);
						} else {
							if (!the.hasClass('jaso'))
							{
								me.hideJasoList();
							}

						}


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
        function getSelectedGlyf() {
            var selected = [];
            this.main.find('.selected').each(function (index, item) {
                selected.push(+item.getAttribute('data-index'));
            });
            return selected;
        }

        /**
         * 绑定命令菜单
         */
		/*
        function bindCommandMenu() {
            var commandMenu = this.commandMenu;

            var me = this;

            // 선택사항이 변경되었을 때 
            me.on('selection:change', lang.debounce(function () {
                var selected = getSelectedGlyf.call(me);
                me.selectedList = selected;

                if (selected.length) {
                    commandMenu.enableCommands(['copy', 'cut', 'del']); // copy, cut, del 활성화 
                    commandMenu[
                        selected.length === 1
                        ? 'enableCommands'
                        : 'disableCommands'
                    ](['setting-font', 'download-glyf']);
                }
                else {
                    commandMenu.disableCommands(['copy', 'cut', 'del', 'setting-font', 'download-glyf']);
                }

            }, 100));

            var delayFocus = lang.debounce(function () {
                me.focus();
            }, 20); 

            commandMenu.on('command', function (e) {
                var command = e.command;
                if (command === 'paste' || command === 'adjust-pos' || command === 'adjust-glyf') {
                    me.fire(command);
                }
                else {
                    var selected = me.getSelected();

                    // 取消选中的glyf
                    if (command === 'cut' || command === 'del') {
                        me.clearSelected();
                    }

                    me.fire(command, {
                        list: selected
                    });
                }

                // 这里延时进行focus
                delayFocus();
            });
        }
		*/
        return function () {

            bindEvents.call(this);

            this.dragSelector = new DragSelector(this.main, {
                onSelect: lang.bind(onDragSelected, this)
            });

			/*
            if (this.options.commandMenu) {
                this.commandMenu = this.options.commandMenu;
                delete this.options.commandMenu;
	            bindCommandMenu.call(this);
            }
			*/
        };
    }
);
