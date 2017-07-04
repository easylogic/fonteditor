/**
 * @file 字形查看器
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var lang = require('common/lang');


        var viewerBinder = require('./binder');
        var viewerRender = require('./render');

		var program = require('../program');
		var actions = require('../../controller/actions');


        function showGLYFForJaso(ttf, list) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = ttf.hhea.descent;
            var selectedHash = {};
            var selectedList = this.selectedList || [];
            selectedList.forEach(function (i) {
                selectedHash[i] = true;
            });

            var glyfStr = '';
            var color = this.options.color;
            var editing = this.getEditing();
            var getGlyfHTML = viewerRender.render;
			var glyfList = ttf.glyf;

            glyfList.forEach(function (glyf, i) {
				if (glyf.name && list.indexOf(glyf.name) > -1 )
				{
					var index = i;
					glyfStr += getGlyfHTML(glyf, ttf, {
						jaso: true,
						index: index,
						unitsPerEm: unitsPerEm,
						descent: descent,
						color: color
					});

				}
            });

			this.main.find(".selected").after(glyfStr);
        }

		 function showGLYF(ttf) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = ttf.hhea.descent;
            var selectedHash = {};
            var selectedList = this.selectedList || [];
            selectedList.forEach(function (i) {
                selectedHash[i] = true;
            });

            var glyfStr = '';
            var color = this.options.color;
            var editing = this.getEditing();
            var startIndex = this.page * this.options.pageSize;
            var endIndex = startIndex + this.options.pageSize;
            var glyfList = ttf.glyf.slice(startIndex, endIndex);
            var getGlyfHTML = viewerRender.render;

            glyfList.forEach(function (glyf, i) {
                var index = startIndex + i;
                glyfStr += getGlyfHTML(glyf, ttf, {
                    index: index,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    selected: selectedHash[index],
                    editing: editing === index,
                    color: color
                });
            });

            this.main.html(glyfStr);
			this.refreshGlyfCount(ttf.glyf.length);
        }


        function refreshGLYF(ttf, refreshList, isJaso) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = ttf.hhea.descent;
            var selectedHash = {};
            var selectedList = this.selectedList || [];

            selectedList.forEach(function (i) {
                selectedHash[i] = true;
            });

			
			var charList = [];
			if (isJaso) {	//  자소 일 경우  자소를 사용하는 모든 문자를 업데이트 해준다. 
				this.main.find("[data-index]").each(function() {
					var index = +$(this).data('index');
					var glyf = ttf.glyf[index];
					if (glyf.unicode && glyf.unicode[0])
					{
						var jaso = actions.splitJaso(glyf.unicode[0]);
						if (jaso && jaso.length)
						{
							refreshList.forEach(function(jasoIndex) {
								if (jaso.indexOf(ttf.glyf[jasoIndex].name) > -1)
								{
									charList.push(index);
								}
							});
						}


						
					}
				});
				
			}

			// 자소를 사용하는 유니코드 문자도 업데이트 
			refreshList = refreshList.concat(charList);

            var main = this.main;
            var color = this.options.color;
            var editing = this.getEditing();
            var getGlyfHTML = viewerRender.render;

            main.hide();
			var me = this; 
            refreshList.forEach(function (index) {
				if (ttf.glyf[index])
				{
					var glyfStr = getGlyfHTML(ttf.glyf[index], ttf, {
						jaso : me.isJaso(index),
						index: index,
						unitsPerEm: unitsPerEm,
						descent: descent,
						selected: selectedHash[index],
						editing: editing === index,
						color: color
					});

					var before = main.find('[data-index="' + index + '"]');
					if (before.length) {
						$(glyfStr).insertBefore(before);
						before.remove();
					}
				}

            });
            main.show();

			this.refreshGlyfCount(ttf.glyf.length);
        }



        /**
         * glyf查看器
         *
         * glyf 리스트 관리기 
         *
         * 기본적으로 글자 폰트를 보여주는 것 이외에 
         *
         * 추가된 Symbol 을 프로젝트 별로 관리 할 수 있게 한다. 
         *
         * 나중에 Symbol 만 공유해도 될 듯하다. 
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         * @param {string} options.color 字形颜色
         * @param {string} options.shapeSize 字形大小
         * @param {number} options.pageSize 分页大小，如果字形个数超过100
         * @param {CommandMenu} options.commandMenu 菜单项
         */
        function GLYFViewer(main, options) {

            this.options = lang.extend({
                color: '', // 글꼴 색상
                shapeSize: 'small', // 글자 크기
                pageSize: 100 // 한페이지당 100개씩
            }, options);

            this.main = $(main);
            this.mode = 'editor';		// 기본을 무조건 edit 모드로, list 모드는 없음. 
            this.page = 0;
            this.selectedList = [];

            viewerBinder.call(this);

        }

		GLYFViewer.prototype.refreshGlyfCount = function (count) {
			$(".glyf-total-count").text(count);
		}

        /**
         * 获取焦点
         */
        GLYFViewer.prototype.focus = function () {
            if (!this.listening) {
                this.listening = true;
                document.body.addEventListener('keydown', this.downlistener);
            }
        };

        /**
         * 失去焦点
         */
        GLYFViewer.prototype.blur = function () {
            if (this.listening) {
                this.listening = false;
                document.body.removeEventListener('keydown', this.downlistener);
            }
        };

        /**
         * 设置分页
         *
         * @param {number} page 页码
         */
        GLYFViewer.prototype.setPage = function (page) {
            this.page = page || 0;
        };

        /**
         * 获取分页
         *
         * @return {number}
         */
        GLYFViewer.prototype.getPage = function () {
            return this.page;
        };

        /**
         * 显示ttf文档
         *
         * @param {Object} ttf ttfObject
         * @param {Array=} selectedList 选中的列表
         *
         */
        GLYFViewer.prototype.show = function (ttf, selectedList, isPageMove) {
            if (selectedList) {
                this.setSelected(selectedList);
            }

			if (this.isJaso(selectedList[0]) && !isPageMove)
			{
				// 자소를 선택했으면 리프레쉬만 합시다. 
	            refreshGLYF.call(this, ttf, selectedList, true);
			} else {
	            showGLYF.call(this, ttf);
			}
			
            this.fire('selection:change');
        };

		GLYFViewer.prototype.isJaso = function (index) {
			return this.main.find("[data-index="+index+"]").hasClass('jaso');
		}


		GLYFViewer.prototype.showJasoList = function (ttf, list) {
			showGLYFForJaso.call(this, ttf, list);
		}

		GLYFViewer.prototype.hideJasoList = function () {
			this.main.find(".jaso").remove();
		}

        /**
         * 刷新ttf文档
         *
         * @param {Object} ttf ttfObject
         * @param {Array=} indexList 需要刷新的列表
         */
        GLYFViewer.prototype.refresh = function (ttf, indexList, isJaso) {
			isJaso = this.isJaso(indexList[0]);
            if (!indexList || indexList.length === 0) {
                showGLYF.call(this, ttf);
            }
            else {
                refreshGLYF.call(this, ttf, indexList, isJaso);
            }
        };

		GLYFViewer.prototype.removeSelectedGlyf = function (unicode) {

			var selected = this.selectedList[0];

			if (selected || unicode )
			{
				if (unicode)
				{
					var glyf  = program.ttfManager.findGlyf({ unicode : unicode });
					selected = glyf[0];
				}

				this.setSelected();		// selected 없애고 
				this.setEditing(-1);	// 에디팅 상태 변경 
				this.fire('del', {
					list: [selected]
				});
			}

		}

        /**
         * 设置选中的列表
         *
         * @param {Array=} selectedList 选中的列表
         */
        GLYFViewer.prototype.setSelected = function (selectedList) {
            this.selectedList = selectedList || [];
        };

        /**
         * 获取选中的列表
         *
         * @return {Array} 选中的indexList
         */
        GLYFViewer.prototype.getSelected = function () {
            return this.selectedList;
        };

        /**
         * 清除选中列表
         */
        GLYFViewer.prototype.clearSelected = function () {
            this.main.children().removeClass('selected');
            this.selectedList = [];
        };

        /**
         * 获取正在编辑的元素索引
         *
         * @return {number} 索引号
         */
        GLYFViewer.prototype.getEditing = function () {
            return this.editingIndex >= 0 ? this.editingIndex : -1;
        };

        /**
         * 设置正在编辑的元素
         *
         * @param {number} editingIndex 设置对象
         */
        GLYFViewer.prototype.setEditing = function (editingIndex) {
            this.clearEditing();
            editingIndex = +editingIndex;
            this.editingIndex = editingIndex >= 0 ? editingIndex : -1;
            if (editingIndex !== -1) {
                this.main.find('[data-index="' + editingIndex + '"]').addClass('editing');
            }
        };

        /**
         * 清除正在编辑的元素
         */
        GLYFViewer.prototype.clearEditing = function () {
            this.main.find('.editing').removeClass('editing');
            this.editingIndex = -1;
        };

        /**
         * 改变设置项目
         * @param {Object} options 设置对象
         */
        GLYFViewer.prototype.setSetting = function (options) {

            var oldOptions = this.options;
            if (options.shapeSize !== oldOptions.shapeSize) {
                this.main.removeClass(oldOptions.shapeSize);
                this.main.addClass(options.shapeSize);
            }

            var needRefresh = false;
            if (options.color !== oldOptions.color) {
                needRefresh = true;
            }

            if (options.pageSize !== oldOptions.pageSize) {
                needRefresh = true;
            }

            this.options = lang.overwrite(oldOptions, options);

            if (needRefresh) {
                this.fire('refresh');
            }
        };

        /**
         * 获取设置项目
         * @return {Object}
         */
        GLYFViewer.prototype.getSetting = function () {
            return this.options;
        };

		GLYFViewer.prototype.showGlyfByUnicode = function (unicode, callback) {
			var glyf  = program.ttfManager.findGlyf({ unicode : unicode });

			var hasGlyf = true; 
			if (!glyf.length)
			{
				// 없는 것이면 마지막에 추가 
				program.ttfManager.insertGlyf({ unicode : [unicode] });

				// 정렬을 해야하는가? 
				//program.ttfManager.sort();

				glyf  = program.ttfManager.findGlyf({ unicode : unicode });
				hasGlyf = false; 
			}

			// glyf index 에 따라 page 를 설정하고, 클릭하게 되면 해당 selection 이 먹겠지? 
			//var page = Math.ceil(glyf[0] / this.options.pageSize);
			//this.setPage(page);

			this.setSelected(glyf);

			// 있는 것이면 바로 선택해서 보여줌. 
			this.show(program.ttfManager.get(), glyf);

			// 편집 객체 선택 
			this.fire('edit', {  lastEditing: this.getEditing(),  list: glyf });

			if (typeof callback == 'function') {
				callback(!hasGlyf);
			}

		};


        /**
         * 设置编辑模式
         *
		 * 리스트 모드, 에디트 모드 설정 
		 * 에디트 모드 일때도 프로젝트 리스트 나오도록 맞춰야할 듯 
		 * 
         * @param {string} mode 编辑模式 list, edit
         */
        GLYFViewer.prototype.setMode = function (mode) {
            this.mode = mode || 'editor';
            if (this.commandMenu) {
                this.commandMenu[this.mode === 'editor' ? 'hide' : 'show']();
            }
        };

        require('common/observable').mixin(GLYFViewer.prototype);

        return GLYFViewer;
    }
);
