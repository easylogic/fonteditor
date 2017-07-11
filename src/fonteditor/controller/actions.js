/**
 * @file FontEditor 命令相关操作
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var settingSupport = require('../dialog/support');
        var program = require('../widget/program');
        var ajaxFile = require('common/ajaxFile');
        var string = require('common/string');
        var lang = require('common/lang');
		var defaultObject = require('../data/default');
        var glyfAdjust = require('fonteditor-core/ttf/util/glyfAdjust');
        var getEmptyttfObject = require('fonteditor-core/ttf/getEmptyttfObject');
		var glyfGenerator = require('../widget/glyf-generator');
		var unicodeType = require('../widget/glyf-unicode-name');

		var getEmptyContent = function () {
			var obj = getEmptyttfObject();
			lang.extend(obj, defaultObject);

			return	obj;
		}

        /**
         * 读取在线字体
         *
         * @param {string} type 类型 svg or binary
         * @param {string} url 文件地址
         */
        function readOnlineFont(type, url) {
            ajaxFile({
                type: type === 'svg' ? 'xml' : 'binary',
                url: url,
                onSuccess: function (buffer) {
                    // binary font 로드 
                    program.loader.load(buffer, {
                        type: type || 'ttf',
                        success: function (imported) {
                            program.loading.hide();
                            program.ttfManager.set(imported);
                            program.data.projectId = null;
                            program.projectViewer.unSelect();
                        }
                    });
                },
                onError: function () {
                    alert(i18n.lang.msg_read_file_error);
                }
            });
        }

        // 延迟focus editor
        var editorDelayFocus = lang.debounce(function () {
            program.editor.focus();
        }, 20);

        // 延迟同步函数
        var fontDelaySync = lang.debounce(function (options) {
            program.loading.show(i18n.lang.msg_syncing, 4000);

            program.sync.addTask(options).then(function (data) {
                if (options.newProject && data && data.newData) {
                    actions['new']({
                        ttf: data.newData,
                        config: {
                            sync: options.config
                        }
                    });
                }
                else if (options.type === 'push' && data && data.newData) {
                    program.ttfManager.ttf.set(data.newData);
                    program.ttfManager.fireChange(true);

                    // 프로젝트 저장하기 , projectid : newData 
                    program.project.update(options.projectId, data.newData).then(function () {
                        // saved 상태 변경 
                        program.ttfManager.setState('saved');
                    });
                }
                program.loading.show(i18n.lang.msg_sync_success, 400);
            }, function (data) {
                if (options.newProject && data.status === 0x1) {
                    alert(i18n.lang.msg_error_sync_font);
                }

                data.reason && console.warn(data.reason);
            });
        }, 500);

        var actions = {

			'move-right' : function () { program.editor.move('right'); }, 
			'move-left' : function () { program.editor.move('left'); }, 
			'move-up' : function () { program.editor.move('up'); }, 
			'move-down' : function () { program.editor.move('down'); }, 

			// 지원되는 모양 입력하기, 외부에서 ajax 형태로 받아오는 리스트는 어떻게 할까 고민해보자. 
			'addsupportshapes' : function (e) {
				var target = $(e.target);
				var type = target.attr('data-type');
				
				// 에디팅 상태랑 상관 없이 적용된다. 
				program.editor.execCommand('addsupportshapes', type);
			},

			'addglyfshapes' : function (e) {
				var target = $(e.target);
				var type = target.attr('data-type');

                console.log(arguments);

				// 에디팅 상태랑 상관 없이 적용된다. 
				program.editor.execCommand('addglyfshapes', type);
			},            

            // 되돌리기 
            'undo': function () {
                if (program.editor.isEditing()) {
                    program.editor.undo();
                    editorDelayFocus();
                }
                else {
                    program.ttfManager.undo();
                }
            },

            // 재실행 
            'redo': function () {
                if (program.editor.isEditing()) {
                    program.editor.redo();
                    editorDelayFocus();
                }
                else {
                    program.ttfManager.redo();
                }
            },

            // 새 폰트 
            'new': function (options) {
                if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                    return;
                }
                program.ttfManager.set((options && options.ttf) || getEmptyContent());
                program.data.projectId = null;

				// 브라우저에 폰트 저장 
                actions.save(options);
            },

            // 가져오기 창 열기 
            'open': function () {
                $('#font-import').click();
            },

            'import': function () {
                if (program.ttfManager.get()) {
                    $('#font-import').click();
                }
            },

            // 내보내기 
            'export': function (e) {
                if (program.ttfManager.get()) { // 폰트를 얻어오고 
                    var target = $(e.target);

                    // exporter 를 사용해서 내보낸다.font 를 
                    program.exporter.export(program.ttfManager.get(), {
                        type: target.attr('data-type'),
                        error: function (ev) {
                            program.fire('font-error', ev);
                        }
                    });
                }
            },

            // 서버로 부터 동기화 한다. 
            'sync-from-server': function () {
                var SettingSync = settingSupport.sync;
                // 从服务器同步字体
                !new SettingSync({
                    onChange: function (setting) {
                        setting.timestamp = -1; // 配置强制拉取
                        fontDelaySync({
                            type: 'pull',
                            newProject: 1,
                            config: setting
                        });
                    }
                }).show({
                    newProject: 1
                });
            },

            // 서버에 동기화(push) 한다. 
            'sync': function (projectId, ttf, config) {
                // 推送字体
                fontDelaySync({
                    type: 'push',
                    projectId: projectId,
                    ttf: ttf,
                    config: config
                });
            },
            //  sync 를 시작한다. , 무조건 자동 ync 모드로 돌아가도록 하자. 
            'dosync': function (projectId) {
                var syncConfig = program.project.getConfig(projectId).sync;
                if (syncConfig && syncConfig.autoSync) {
                    actions.sync(projectId, program.ttfManager.get(), syncConfig);
                }
            },

            // 폰트를 저장한다. 
            'save': function (options) {
                if (program.ttfManager.get()) {
                    // 已经保存过的项目
                    var projectId = program.data.projectId;
                    if (projectId) {    // project id 가 있을 때 
                        program.project.update(projectId, program.ttfManager.get()) // projectid : font 를 저장한다. 
                        .then(function () {
                            // 저장한 이후에 ttfManager 의 상태를 바꾼다. 
                            program.ttfManager.setState('saved');
                            program.loading.show(i18n.lang.msg_save_success, 400);
                            actions['dosync'](projectId);
                        }, function () {
                            program.loading.show(i18n.lang.msg_save_failed, 1000);
                        });

                    }
                    // 未保存的项目
                    else {
                        var name = program.ttfManager.get().name.fontFamily || '';
                        if ((name = window.prompt(i18n.lang.msg_input_proj_name, name))) {
                            name = string.encodeHTML(name);
                            options = options || {};
                            program.project.add(
                                name,
                                options.ttf || program.ttfManager.get(),
                                options.config
                            ).then(function (id) {
                                program.data.projectId = id;
                                program.ttfManager.setState('new');
                                program.projectViewer.show(program.project.items(), id);
                                program.loading.show(i18n.lang.msg_save_success, 400);

                            }, function () {
                                program.loading.show(i18n.lang.msg_save_failed, 400);
                            });
                        }
                    }
                }
            },

            'add-new': function () {
                if (program.ttfManager.get()) {
                    var selected = program.viewer.getSelected();
                    program.ttfManager.insertGlyf({}, selected[0]);
                }
                else {
                    // 没有项目 先建立一个项目
                    actions.new();
                }
            },

            'add-online': function () { // online 에서 폰트 추가 
                var SettingOnline = settingSupport.online;
                !new SettingOnline({
                    onChange: function (url) {
                        if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                            return;
                        }

                        program.loading.show(i18n.lang.msg_loading, 1000);
                        // 此处延迟处理
                        setTimeout(function () {
                            var type = url.slice(url.lastIndexOf('.') + 1);
                            var fontUrl = url;

                            if (/^https?:\/\//i.test(url)) {
                                fontUrl = string.format(program.config.readOnline, ['font', encodeURIComponent(url)]);
                            }
                            readOnlineFont(type, fontUrl);
                        }, 20);
                    }
                }).show();
            },

            'add-url': function () {
                var SettingUrl = settingSupport.url;
                !new SettingUrl({
                    onChange: function (url) {
                        if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                            return;
                        }

                        program.loading.show(i18n.lang.msg_loading, 1000);
                        // 此处延迟处理
                        setTimeout(function () {
                            var fontUrl = string.format(program.config.readOnline, ['font', encodeURIComponent(url)]);
                            readOnlineFont(url.slice(url.lastIndexOf('.') + 1), fontUrl);
                        }, 20);
                    }
                }).show();
            },

            'preview': function (e) {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var format = e.target.getAttribute('data-format');
                    program.previewer.load(ttf, format);
                }
            },

			'setting-glyf-generate-template': function () {
               var ttf = program.ttfManager.get();
                if (ttf) {
					var glyfList = glyfGenerator.generate(unicodeType.KOREAN).map(function(name) {

						return {
							unicode : [],
							name : name,
							contours : []	
						}; 
					});

					program.ttfManager.insertTemplateGlyf(glyfList);
                }
			},

			'splitJaso' : function (unicode) {
				return glyfGenerator.splitJaso(unicodeType.KOREAN, unicode);
			},

			//  템플릿으로 한글 코드 자동 생성 
			'setting-make-korean-glyf' : function (hasEvent) {
				if (typeof hasEvent == 'undefined') {
					hasEvent = true; 
				}

				var ttf = program.ttfManager.get();

				if (ttf)
				{
					var checkKeys = glyfGenerator.getCheckKeys(unicodeType.KOREAN);

					//  키를 가지고 있는 목록만 추림 
					var keys = {};
					ttf.glyf.forEach(function (g, i) {	
						if (g.name && g.name.length && checkKeys.indexOf(g.name.split('-')[0]) > -1)
						{
							keys[g.name] = { index : i, glyf : g }; 
						}
					});


					var realGlyfList = glyfGenerator.makeUnicodeGlyf(unicodeType.KOREAN, keys);

					program.ttfManager.insertUnicodeGlyf(realGlyfList, hasEvent); 
				}
			},

            // 이름 설정하기 
            'setting-name': function () {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var SettingName = settingSupport.name;
                    !new SettingName({
                        onChange: function (setting) {
                            program.ttfManager.setInfo(setting);
                        }
                    }).show($.extend({}, ttf.head, ttf.name));
                }
            },

			// 글자 찾기 
			'find-glyf' : function () {
				program.viewer.fire('find-glyf');
			},

			// 글자 줄이기
			'setting-reduce-unicode' : function () {
				program.viewer.fire('setting-reduce-unicode');
			},

			'download-glyf' : function () {

				var selected = program.viewer.getSelected();

				program.viewer.fire('download-glyf', {
					list : selected
				});
			},

            // 좌표 설정하기 
            'setting-metrics': function () {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var SettingMetrics = settingSupport.metrics;
                    !new SettingMetrics({
                        onChange: function (setting) {
                            program.ttfManager.setMetrics(setting);
                        }
                    }).show($.extend({}, ttf['OS/2'], ttf.hhea, ttf.post));
                }
            },

            // glyf 이름 설정하기 
            'setting-glyf-name': function () {
                if (program.ttfManager.get()) {
                    if (window.confirm(i18n.lang.msg_confirm_gen_names)) {
                        program.ttfManager.genGlyfName(program.viewer.getSelected());
                    }
                }
            },

            'setting-glyf-clearname': function () {
                if (program.ttfManager.get()) {
                    program.ttfManager.clearGlyfName(program.viewer.getSelected());
                }
            },

            // 현재 폰트 최적화 하기 
            'setting-optimize': function () {
                if (program.ttfManager.get()) {
                    var result = program.ttfManager.optimize();
                    if (true !== result) {
                        if (result.repeat) {
                            program.fire('font-error', {
                                number: 10200,
                                data: result.repeat
                            });
                        }
                        alert(result.message);
                    }
                }
            },


            // 정렬하기 
            'setting-sort': function () {
                if (program.ttfManager.get()) {
                    var result = program.ttfManager.sortGlyf();
                    if (true !== result) {
                        alert(result.message);
                    }
                }
            },

            // 윤곽선 최적화 
            'setting-compound2simple': function () {
                if (program.ttfManager.get()) {
                    program.ttfManager.compound2simple(program.viewer.getSelected());
                }
            },

            'layout-editor-only' : function () {
				program.fire('resize', { showMain : false, showEditor : true,  showSidebar : false });
            },


            'layout-glyf-only' : function () {
				program.fire('resize', { showMain : true, showEditor : true,  showSidebar : false });
            },


            'layout-project-only' : function () {
				program.fire('resize', { showMain : false, showEditor : true,  showSidebar : true });
            },

            'layout-all' : function () {
				program.fire('resize', { showMain : true, showEditor : true,  showSidebar : true });
            },

            'layout-glyf-viewer' : function () {
				program.fire('resize', { showMain : false, showEditor : false,  showSidebar : true });
            },

            'setting-editor': function () {
                var SettingEditor = settingSupport.editor;
                !new SettingEditor({
                    onChange: function (setting) {
                        program.setting.set('editor', setting, setting.saveSetting);
                        setTimeout(function () {
                            program.viewer.setSetting(setting.viewer);
                            program.editor.setSetting(setting.editor);
                        }, 20);
                    }
                }).show(program.setting.get('editor'));
            },

            // 사진 가지고 오기 
            'import-pic': function (glyf) {
                var SettingEditor = settingSupport['import-pic'];
                if (program.ttfManager.get()) {
                    !new SettingEditor({
						isSimple : program.isSimpleMode,
						glyf: glyf,
						onDispose : function (setting) {
							if (program.isSimpleMode)
							{
								$("#innerdialog-setting-shape-maker").show();
							}

						},
                        onChange: function (setting) {
                            if (setting.contours) {

                                if (program.editor.isVisible()) {
                                    program.editor.execCommand('addcontours', setting.contours, {
                                        scale: 1,
                                        selected: true
                                    });
                                    editorDelayFocus();
                                }
                                else {
                                    var selected = program.viewer.getSelected();
                                    program.ttfManager.insertGlyf(glyfAdjust({
                                        contours: setting.contours
                                    }, 1, 1, 0, 0, false), selected[0]);
                                }
                            }

						
                        }
                    }).show();
					if (program.isSimpleMode)
					{
						$("#innerdialog-setting-shape-maker").hide();
					}

                }
            },


			// glyf 가져오기, name 과 unicode 기준으로 참고할 glyf 리스트를 보여준다.  
            'import-glyf': function (glyf) {

                var SettingEditor = settingSupport['import-glyf'];
                if (program.ttfManager.get()) {
                    !new SettingEditor({
						isSimple : program.isSimpleMode,
						glyf: glyf,
						onDispose : function (setting) {
							if (program.isSimpleMode)
							{
								$("#innerdialog-setting-shape-maker").show();
							}

						},
                        onChange: function (setting) {
                           						
                        }
                    }).show();
                }
            },

            'setting-import-and-export': function () {
                var SettingEditor = settingSupport.ie;
                !new SettingEditor({
                    onChange: function (setting) {
                        program.setting.set('ie', setting, setting.saveSetting);
                    }
                }).show(program.setting.get('ie'));
            }
        };

        return actions;
    }
);
