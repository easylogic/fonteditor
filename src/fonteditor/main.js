/**
 * @file FontEditor入口函数
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('./i18n/i18n');
        var program = require('./widget/program');
        var controller = require('./controller/default');
        var actions = require('./controller/actions');
		var imgCount=2;

        function loadFiles(files) {
            var file = files[0];
            if (program.data.action === 'open' && program.loader.supportLoad(file.name)) {
                program.loader.load(file, {
                    type: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
                    success: function (imported) {
                        program.viewer.clearSelected();
                        program.ttfManager.set(imported);
                        program.data.projectId = null;
                    }
                });
            }
            else if (program.data.action === 'import' && program.loader.supportImport(file.name)) {
                if (program.ttfManager.get()) {
                    var ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
                    var reg = new RegExp('\.' + ext + '$', 'i');
                    var files = Array.prototype.slice.call(files).filter(function (f) {
                        return reg.test(f.name);
                    });

                    files.forEach(function (f) {
                        program.loader.load(f, {
                            type: ext,
                            success: function (imported) {
                                if (imported.glyf.length) {
                                    program.ttfManager.merge(imported, {
                                        scale: true,
                                        adjustGlyf: imported.from === 'svg' ? true : false
                                    });
                                }
                            }
                        });
                    });
                }
            }
            else {
                alert(i18n.lang.msg_not_support_file_type);
            }
        }

        function onUpFile(e) {
            loadFiles(e.target.files);
            e.target.value = '';
        }

        function onDrop(e) {
            e.stopPropagation();
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            var ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
            program.data.action = ext === 'svg' ? 'import' : 'open';
            loadFiles(e.dataTransfer.files);
        }

        function bindEvent() {
			// 외부 버튼들 이벤트 설정,  data-action 으로 기능 정의 
            $('.action-groups').delegate('[data-action]', 'click',  function (e) {
                var action = this.getAttribute('data-action');
                if ('1' !== this.getAttribute('data-disabled') && actions[action]) {
                    program.data.action = action;
                    actions[action].call(this, e);
                }
            });

            document.getElementById('font-import').addEventListener('change', onUpFile);
            // 문서 전체 드래그 막기 
            $(document).on('dragleave drop dragenter dragover', function (e) {
                e.preventDefault();
            });

			// 글자 목록에 드래그 앤 드롭 
			// woff, eot, ttf, svg  등의 폰트 파일 
			// 순수하게 그림 하나 있는  svg  파일 
            document.getElementById('glyf-list').addEventListener('drop', onDrop);
        }

        function loadProject(projectId) {
            if (!program.project.getConfig(projectId)) {
                return;
            }

            program.project.ready().then(function () {
                program.projectViewer.select(projectId);	// 화면 설정 바꾸고 
                program.projectViewer.fire('open', {		// open 이벤트를 발생시킨다. 
                    projectId: projectId
                });
            });
        }

        function getProjectId() {
            var projectId = null;
            // 从 url 中读取 id
            if (location.search) {
                var query = require('common/lang').parseQuery(location.search.slice(1))
                if (query.project) {
                    projectId = query.project;
                }
            }
            // 上一次打开的项目
            if (!projectId) {
                 projectId = window.localStorage.getItem('project-cur');
            }
            return projectId;
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {

				//var img1=new Image();
				//img1.src="https://mdn.mozillademos.org/files/222/Canvas_createpattern.png";

				//program.pattern1 = img1;

				window.program = program;

                bindEvent();

				program.isSimpleMode = $("body").hasClass("simple-mode");

                program.setting = require('./widget/settingmanager');
				program.setting.setSimpleMode(program.isSimpleMode);

                program.config = require('./config');


                // 项目管理
                var ProjectViewer = require('./widget/ProjectViewer');
                program.project = require('./widget/project');
                program.projectViewer = new ProjectViewer($('#project-list'));

                // ttf管理
                var TTFManager = require('./widget/TTFManager');
                program.ttfManager = new TTFManager();

                // 导入导出器
                program.loader = require('./widget/loader');
                program.exporter = require('./widget/exporter');

                // 预览器
                program.previewer = require('./widget/previewer');

                // 同步组件
                program.sync = require('./widget/sync');

                // glyf查看器命令组
                var Toolbar = require('./widget/Toolbar');

                var Pager = require('./widget/Pager');
                program.viewerPager = new Pager($('#glyf-list-pager'));

                // glyf查看器
                var GLYFViewer = require('./widget/glyfviewer/GLYFViewer');
                program.viewer = new GLYFViewer($('#glyf-list'));


                // 字体查看器命令组
                var editorCommandMenu = new Toolbar($('#editor-commandmenu'), {
                    commands: program.isSimpleMode ? require('./menu/simple-editor') : require('./menu/editor')
                });

                var screenCommandMenu = new Toolbar($('#editor-commandmenu-bottom'), {
                    commands: program.isSimpleMode ? require('./menu/simple-screen') : require('./menu/screen')
                });

                // 字体查看器
                var GLYFEditor = require('./widget/GLYFEditor');
                program.editor = new GLYFEditor($('#glyf-editor'), {
                    commandMenu: editorCommandMenu,
					screenCommandMenu : screenCommandMenu
                });

                controller.init(program);

                // 加载用户设置
                if (program.setting.isStored('editor')) {
                    var setting = program.setting.get('editor');
                    program.viewer.setSetting(setting.viewer);
                    program.editor.setSetting(setting.editor);
                }

                // 加载项目
                program.projectViewer.show(program.project.items());
                var projectId = getProjectId();
                if (projectId) {
                    loadProject(projectId);
                }


            }
        };

        entry.init();

        return entry;
    }
);
