/**
 * @file 字形编辑器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var editorFactory = require('editor/main');
        var editorOptions = require('editor/options');
        var simpleOptions = require('editor/simple-options');
        var settingSupport = require('../dialog/support');
        var innerDialogSupport = require('./innerdialog/support');
        var program = require('./program');
        var lang = require('common/lang');


        // 支持的命令列表
        var COMMAND_SUPPORT = {
            // 形状组
            shapes: [
                //'copyshapes', 'cutshapes', 'removeshapes', 
				
				'reversepoints','horizontalalignshapes', 'verticalalignshapes',
                'rotateleft', 'rotateright', 'flipshapes', 'mirrorshapes', 'addsymbol'
            ],
            shapes2: [
                'joinshapes', 'intersectshapes', 'tangencyshapes'
            ],
            // 单个形状
            shape: ['pointmode', 'upshape', 'downshape'],
			point : [ 'addpoint', 'removepoint', 'onCurve', 'offCurve', 'asStart' ]
        };


        /**
         * 绑定editor编辑器
         */
        function bindEditor() {

            // 设置字形信息
            var me = this;
            var editor  = this.editor;
            var delayFocus = lang.debounce(function () {
                me.focus();
            }, 20);

            editor.on('setting:font', function (e) {
                var SettingGlyf = settingSupport.glyf;
                !new SettingGlyf({
                    onChange: function (setting) {
                        editor.adjustFont(setting);
                        // 此处需要等待点击完成后设置focus状态
                        delayFocus();
                    }
                }).show(e.setting); 

            });

            editor.on('setting:editor', function (e) {
                var SettingEditor = settingSupport.editor;
                var dlg = new SettingEditor({
                    onChange: function (setting) {
                        setTimeout(function () {
                            program.viewer.setSetting(setting.viewer);
                            me.setSetting(setting.editor);
                        }, 20);
                    }
                });
                dlg.show({
                    viewer: program.viewer.getSetting(),
                    editor: e.setting
                });
            });

            var screenCommandMenu = this.screenCommandMenu; 

            if (screenCommandMenu) {
                screenCommandMenu.on('command', function (e) {
                     // 这里延时进行focus
                    delayFocus();

                    var command = e.command;
                    var args = e.args;

					// 객체 선택과 상관없이 동작하는 command 
					switch(command) {
						case 'showgrid': 
						case 'showoutline': 
						case 'showaxis': 
						case 'showreference': 
						case 'rescale': 
						case 'enlargeview':
						case 'narrowview': 
							editor.execCommand(command);
							break;

						// TODO: 이건 새로 구해보자. rescale 의 숫자 범위를 명확히 해야 정확히 구할 수 있다. 
						// 가운데 지점을 정확히 찾을 수가 없어서 다시 해봐야한다. 
						//case 'scaleinput': 
						//	editor.execCommand('rescale', (+args)/100);
						//	break;
						case 'move-left': 
						case 'move-right': 
						case 'move-up': 
						case 'move-down': 
							editor.execCommand('moveview', { direction : command.split('-')[1] } );
							break;
					}

                });
            }

            var commandMenu = this.commandMenu;
            if (commandMenu) {

                editor.on('selection:change', lang.debounce(function (e) {
                    var length = e.shapes ? e.shapes.length : 0;
                    if (!length) {
                        commandMenu.disableCommands(COMMAND_SUPPORT.shapes);
                        commandMenu.disableCommands(COMMAND_SUPPORT.shapes2);
                        commandMenu.disableCommands(COMMAND_SUPPORT.shape);
                        commandMenu[editor.mode.type == 'point' ? 'enableCommands' : 'disableCommands'](COMMAND_SUPPORT.point);

                    }
                    else {
                        commandMenu.enableCommands(COMMAND_SUPPORT.shapes);
                        commandMenu.enableCommands(COMMAND_SUPPORT.point);
                        commandMenu[length >= 2 ? 'enableCommands' : 'disableCommands'](COMMAND_SUPPORT.shapes2);
                        commandMenu[length === 1 ? 'enableCommands' : 'disableCommands'](COMMAND_SUPPORT.shape);
                    }
                }), 100);

				 editor.on('change', lang.debounce(function (e) {
                    commandMenu[editor.mode.type == 'point' ? 'enableCommands' : 'disableCommands'](COMMAND_SUPPORT.point);
                }), 100);

                commandMenu.on('command', function (e) {

                    // 这里延时进行focus
                    delayFocus();

                    var command = e.command;
                    var args = e.args;
                    var shapes;

                    if (command === 'save') {
                        program.fire('save', {
                            saveType: 'editor'
                        });
                        return;
                    }

					if (command === 'import-pic')
					{
						program.fire('import-pic');
						return;
					}

					if (command === 'import-glyf')
					{
						program.fire('import-glyf');
						return;
					}

					
                    if (command === 'splitshapes') {
                        editor.setMode('split');
                        return;
                    }

					

                    if (command === 'pasteshapes') {
                        shapes = editor.getClipBoard();
                    }
                    else {
                        shapes = editor.getSelected();
                    }

                    if (shapes && shapes.length) {
                        switch (command) {
                            case 'pointmode':
                                editor.setMode('point', shapes[0]);
                                break;
                            case 'topshape':
                            case 'bottomshape':
                            case 'upshape':
                            case 'downshape':
                                editor.execCommand(command, shapes[0]);
                                break;
                            case 'copyshapes':
                            case 'cutshapes':
                            case 'pasteshapes':
                            case 'removeshapes':
                            case 'reversepoints':
                            case 'joinshapes':
                            case 'intersectshapes':
                            case 'tangencyshapes':
                            case 'rotateleft':
                            case 'rotateright':
                            case 'flipshapes':
                            case 'mirrorshapes':
                            case 'cutshapes':
                            case 'copyshapes':
                            case 'removeshapes':
                            case 'reversepoints':
                            case 'joinshapes':
                            case 'intersectshapes':
                            case 'tangencyshapes':
                            case 'addsymbol':
                                editor.execCommand(command, shapes);
                                break;

                            case 'alignshapes':
                            case 'verticalalignshapes':
                            case 'horizontalalignshapes':
                                editor.execCommand(command, shapes, args.align);
                                break;
                        }
                    } else if (command === 'rangemode') {
                        editor.setMode('bound');
                    } else if (command === 'addpath') {
                        editor.execCommand('addpath'); 
                    } else if (command === 'addpoint') {
						editor.execCommand('addpoint'); 
                    } else if (command === 'removepoint') {
						editor.execCommand('removepoint'); 
                    } else if (command === 'onCurve') {
						editor.execCommand('onCurve'); 
                    } else if (command === 'offCurve') {
						editor.execCommand('offCurve'); 
                    } else if (command === 'asStart') {
						editor.execCommand('asStart'); 
                    }
                });
            }
        }

        /**
         * 执行指定命令
         *
         * @param {string} command 命令名
         */
        function execCommand() {
            if (this.editor) {
                this.editor.execCommand.apply(this.editor, arguments);
            }

        }

        /**
         * font查看器
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         * @param {CommandMenu} options.commandMenu 命令菜单对象
         */
        function GLYFEditor(main, options) {

            this.main = $(main);
            this.options = lang.extend({}, options);

            if (this.options.commandMenu) {
                this.commandMenu = this.options.commandMenu;
                delete this.options.commandMenu;
            }

            if (this.options.screenCommandMenu) {
                this.screenCommandMenu = this.options.screenCommandMenu;
                delete this.options.screenCommandMenu;
            }

            if (!this.editor) {
				this.main.find('h1').hide();
                this.editor = editorFactory.create(this.main.get(0), { simple : program.isSimpleMode });
                bindEditor.call(this);
            }

			// inner dialog create 
			this.createInnerDialog();

        }

		GLYFEditor.prototype.createInnerDialog = function () {
			this.innerDialog = {};

			Object.keys(innerDialogSupport).forEach(lang.bind(function(name) {
				var InnerDialog = innerDialogSupport[name];

				this.innerDialog[name] = new InnerDialog({
					glyfeditor : this
				});
			}, this));
		}

        /**
         * 显示
         */
        GLYFEditor.prototype.show = function () {
            // 这里注意显示顺序，否则editor创建的时候计算宽度会错误
            this.main.show();


            this.editing = true;
        };

        /**
         * 隐藏
         */
        GLYFEditor.prototype.hide = function () {
            this.editor && this.editor.blur();
            this.main.hide();
            this.editing = false;
        };

        /**
         * 是否编辑中
         * @return {boolean} 是否
         */
        GLYFEditor.prototype.isEditing = function () {
            return this.editing;
        };

        /**
         * 是否可见
         * @return {boolean} 是否
         */
        GLYFEditor.prototype.isVisible = function () {
            return this.editor && this.main.get(0).style.display !== 'none';
        };

        /**
         * 获取焦点
         */
        GLYFEditor.prototype.focus = function () {
            this.editing = true;
            this.editor && this.editor.focus();
        };

        /**
         * 失去焦点
         */
        GLYFEditor.prototype.blur = function () {
            this.editing = false;
            this.editor && this.editor.blur();
        };

        /**
         * 撤销
         */
        GLYFEditor.prototype.undo = function () {
            execCommand.call(this, 'undo');
        };

        /**
         * 重做
         */
        GLYFEditor.prototype.redo = function () {
            execCommand.call(this, 'redo');
        };

		GLYFEditor.prototype.getDefaultOptions = function (options) {
			return editorOptions;
            //return (program.isSimpleMode ? simpleOptions : editorOptions);
		}

        /**
         * 设置项目
         * @param {Object} options 参数集合
         */
        GLYFEditor.prototype.setSetting = function (options) {
            if (this.editor) {
                this.editor.setOptions(options);
            }
            else {
                lang.overwrite(this.getDefaultOptions().editor, options);
            }
        };

        /**
         * 获取设置项目
         * @return {Object} 设置项目
         */
        GLYFEditor.prototype.getSetting = function () {
            return this.editor ? this.editor.options : this.getDefaultOptions().editor;
        };


        /**
         * 获取设置项目
         * @return {Object} 设置项目
         */
        GLYFEditor.prototype.execCommand = execCommand;

        /**
         * 注销
         */
        GLYFEditor.prototype.dispose = function () {
            this.editor.dispose();
            this.main = this.options = this.editor = null;
        };

        // 导出editor的函数
        [
            'reset', 'setFont', 'getFont',
            'isChanged', 'setChanged', 'setAxis', 'adjustFont'
        ].forEach(function (fn) {
            GLYFEditor.prototype[fn] = function () {
                return this.editor ? this.editor[fn].apply(this.editor, arguments) : undefined;
            };
        });

        return GLYFEditor;
    }
);
