/**
 * @file TTF 관리하는 매니저 플러그인 
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var lang = require('common/lang');
        var History = require('editor/widget/History');
        var TTF = require('fonteditor-core/ttf/ttf');
        var string = require('fonteditor-core/ttf/util/string');
        var transformGlyfContours = require('fonteditor-core/ttf/util/transformGlyfContours');
        var compound2simple = require('fonteditor-core/ttf/util/compound2simple');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        /**
         * 清除glyf编辑状态
         *
         * 수정상태 지우기 
         *
         * @param {Array} glyfList glyf列表
         * @return {Array} glyf列表
         */
        function clearGlyfTag(glyfList) {
            glyfList.forEach(function (g) {
                delete g.modify;
            });
            return glyfList;
        }

        /**
         * 构造函数
         *
         * @constructor
         * @param {ttfObject} ttf ttf对象
         */
        function Manager(ttf) {
            this.ttf = new TTF(ttf);
            this.changed = false; // ttf是否被改过
            this.history = new History({
                maxRecord : 2
            });
        }

        /**
         * 保存一个glyf副本
         *
         * 히스토리 추가 ttf 데이타를 그대로 넣는다. 
         *
         * @return {this}
         */
        Manager.prototype.pushHistory = function () {
            this.history.add(lang.clone(this.ttf.get()));
            return this;
        };

        /**
         * 触发change
         *
         * @param {boolean} pushHistory 是否存入history列表
         * @param {string} changeType 改变类型
         *
         * @return {this}
         */
        Manager.prototype.fireChange = function (pushHistory, changeType) {
            pushHistory && this.pushHistory();
            this.changed = true;
            this.fire('change', {
                ttf: this.ttf.get(),
                changeType: changeType || 'change'
            });
            return this;
        };

        /**
         * 设置ttf
         *
         * @param {ttfObject} ttf ttf对象
         * @return {this}
         */
        Manager.prototype.set = function (ttf) {

            if (this.ttf.get() !== ttf) {
                this.ttf.set(ttf);
                clearGlyfTag(this.ttf.getGlyf());

                this.history.reset();
                this.pushHistory();

                this.changed = false;

                this.fire('set', {
                    ttf: this.ttf.get()
                });
            }

            return this;
        };

        /**
         * 获取ttf对象
         *
         * 폰트 얻어오기 
         *
         * @return {ttfObject} ttf ttf对象
         */
        Manager.prototype.get = function () {
            return this.ttf.get();
        };

		Manager.prototype.clone = function (opt) {
			var cloneTTF = new Manager(lang.clone(this.ttf.get()));

			opt = opt || {};

			if (opt.empty) {
				cloneTTF.emptyGlyf();
			}

            // subset
			if (opt.reduceGlyf) {
				cloneTTF = cloneTTF.reduceGlyf(opt.reduceGlyf);
			}
			
			if (opt.optimize){
				cloneTTF.optimize();
			}

			return cloneTTF;
		}

		Manager.prototype.reduceGlyf = function (text) {

            var indexList = this.ttf.findGlyf({
                unicode: text.split('').map(function (u) {
                    return u.codePointAt(0);
                })
            });

            if (indexList.length) {
                var glyfList = this.ttf.getGlyf(indexList);
                glyfList.unshift(this.ttf.getGlyfByIndex(0));
                this.ttf.get().glyf = glyfList;
            }
            else {
                this.ttf.get().glyf = [this.ttf.getGlyfByIndex(0)];
            }

            // 변경 이벤트 발생 
            this.fireChange(true);

            return this;
		};

		// 모양이 없는 glyf 삭제 
		Manager.prototype.emptyGlyf = function () {
			var glyf = this.ttf.get().glyf;

			var temp = [];
			for(var i = 0, len = glyf.length; i < len; i++) {
				if (glyf[i].modify && glyf[i].modify  == 'new')
				{
					continue;
				} else if (!glyf[i].contours || glyf[i].contours.length == 0) {	// 유니코드만 있고 contours 가 없는 것도 삭제 
					continue;
				}

				temp.push(glyf[i]);
			}

			this.ttf.get().glyf = temp;
		}


        /**
         * 查找glyf
         *
         * glyph 를 찾아준다. condition 에 맞게 
         *
         * @param {Object} condition 查询条件
         *
         * @return {Array} 找到返回glyf列表
         */
        Manager.prototype.findGlyf = function (condition) {
            if (null != condition.index) {
                var size = this.ttf.getGlyf().length;
                return condition.index.filter(function (index) {
                    return index >= 0 && index < size;
                });
            }

            return this.ttf.findGlyf(condition);
        };

        /**
         * 在指定索引前面添加新的glyf
         *
         * glyf 를 추가한다. beforeIndex 앞에 
         *
         * @param {Object} glyf 对象
         * @param {number} beforeIndex 索引号
         *
         * @return {this}
         */
        Manager.prototype.insertGlyf = function (glyf, beforeIndex, isGenerateName) {
            var glyfList = this.ttf.getGlyf();
            var unicode = 0x20;

            // 유니코드 생성 
            if (!glyf.unicode || !glyf.unicode.length) {
                // 找到unicode的最大值
                for (var i = glyfList.length - 1; i > 0; i--) {
                    var g = glyfList[i];
                    if (g.unicode && g.unicode.length) {
                        var u = Math.max.apply(null, g.unicode);
                        unicode = Math.max(u, unicode);
                    }
                }

                unicode++;

                if (unicode === 0xFFFF) {
                    unicode++;
                }

                glyf.unicode = [unicode];
            }
             // 유니코드 이름 생성 
            if (isGenerateName && !glyf.name) {
                glyf.name = string.getUnicodeName(glyf.unicode[0]);
            }

            // 수정상태 저장 
            glyf.modify = 'new';

            // 폰트에 glyf 넣기 
            //this.ttf.insertGlyf(glyf, beforeIndex);
			this.ttf.addGlyf(glyf);	//  마지막에 추가 하는걸로 합시다. 

            // 변경 이벤트 발생 
            this.fireChange(true);

            return this;
        };

		 Manager.prototype.insertTemplateGlyf = function (templateGlyfList) {
            var glyfList = this.ttf.getGlyf();

			templateGlyfList.forEach(function(glyf) {
				glyf.modify = 'new';
			});

			var retList = this.ttf.insertMultipleGlyf(templateGlyfList, true);

            // 변경 이벤트 발생 
            this.fireChange(true);

            return this;
        };

		Manager.prototype.copyGlyfTemplate = function (checkFunc, convertFunc) {


			var keys = {};
			var ttf = this.ttf; 
			ttf.glyf.forEach(function(g, i) {
				if (checkFunc(g))
				{
					keys[g.name] = i;
				}
			});


			Object.keys(keys).forEach(function(key) {
				var glyfIndex = keys[key];

				if (glyfIndex && ttf.glyf[glyfIndex])
				{
					convertFunc(key, /* current glyf index*/glyfIndex, /* glyf name map */keys, /* glyf list */ttf.glyf);
				}
			});
		}

		// 유니코드 업데이트 하기 
		 Manager.prototype.insertUnicodeGlyf = function (glyfList, hasEvent) {
			var unitsPerEm = this.ttf.get().head.unitsPerEm;
			var advanceWidth = unitsPerEm; 
			var map  = this.ttf.getMapIndex();
			for(var i = 0, len = glyfList.length; i < len; i++) {
				var g = glyfList[i];
				var contours = g.contours;

				// contours 기반으로 좌우여백 다시 설정 
		
				// 设置边界
				var box = computeBoundingBox.computePathBox.apply(null, contours) || {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				};
			  
				g.xMin = box.x;
				g.yMin = box.y;
				g.xMax = box.x + box.width;
				g.yMax = box.y + box.height;
				g.leftSideBearing = g.xMin;
				g.advanceWidth = advanceWidth;

				if (box) {
                    g.rightSideBearing = g.advanceWidth - box.x - box.width;
                } else {
                    g.rightSideBearing = g.advanceWidth;
                }

				if (box.width === 0) {
					g.advanceWidth = g.rightSideBearing;
				}
				else {
					g.advanceWidth = advanceWidth || (g.xMax + g.rightSideBearing) || g.xMax;
				}

				delete g.rightSideBearing;

				g.contours = contours;


				var findIndex = map[g.unicode[0]];

				if (findIndex)
				{
					this.ttf.replaceGlyf(g, findIndex);
				} else {
					this.ttf.addGlyf(g);	
				}
			}

			// 변경 이벤트 발생 
			if (hasEvent !== false)
			{
                // 전체 유니코드를 다시 생성할 때는 
                // pushHistory 에 들어가는 순간 메모리에 이전 ttf 를 객체를 그대로 가지고 있기 때문에 
                // pushHistory 를 적재하지 않는다.                 
				this.fireChange(false, 'replace');
			}


            return this;
        };

        /**
         * 合并两个ttfObject，此处仅合并简单字形
         *
         * 로드한 폰트 합치기 
         *
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
         *
         * @return {this}
         */
        Manager.prototype.merge = function (imported, options) {

            var list = this.ttf.mergeGlyf(imported, options);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'new';
                });
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 删除指定字形
         *
         * glyf 삭제 하기 
         *
         * @param {Array=} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.removeGlyf = function (indexList, isRe) {

            var list = this.ttf.removeGlyf(indexList);
            if (list.length) {
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 设置unicode代码
         *
         * 유니코드 설정하기 
         *
         * @param {string} unicode unicode代码
         * @param {Array=} indexList 索引列表
         * @param {boolean} isGenerateName 是否生成name
         * @return {this}
         */
        Manager.prototype.setUnicode = function (unicode, indexList, isGenerateName) {

            var list = this.ttf.setUnicode(unicode, indexList, isGenerateName);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 生成字形名称
         *
         * 이름 생성하기 
         *
         * @param {Array=} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.genGlyfName = function (indexList) {

            var list = this.ttf.genGlyfName(indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 清除字形名称
         *
         * 이름 지우기 
         *
         * @param {Array=} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.clearGlyfName = function (indexList) {

            var list = this.ttf.clearGlyfName(indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 添加并体替换指定的glyf
         *
         * glyf 추가 
         *
         * @param {Array} glyfList 添加的列表
         * @param {Array=} indexList 需要替换的索引列表
         * @return {this}
         */
        Manager.prototype.appendGlyf = function (glyfList, indexList) {

            var list = this.ttf.appendGlyf(glyfList, indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'new';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 替换指定的glyf
         *  
         * glyf 교체하기 
         *
         * @param {Object} glyf glyfobject
         * @param {string} index 需要替换的索引列表
         * @return {this}
         */
        Manager.prototype.replaceGlyf = function (glyf, index) {
            var list = this.ttf.replaceGlyf(glyf, index);
            if (list.length) {
                list[0].modify = 'edit';

                // 글자 하나 변경할때 전체 히스토리를 저장해야하는가? 
                // 일단 저장안하는걸로  
                this.fireChange(true,  'replace');
            }
            return this;
        };

        /**
         * 调整glyf位置
         *
         * Glyf 위치 맞추기 
         *
         * @param {Array=} indexList 索引列表
         * @param {Object} setting 选项
         * @return {boolean}
         */
        Manager.prototype.adjustGlyfPos = function (indexList, setting) {

            var list = this.ttf.adjustGlyfPos(indexList, setting);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 调整glyf
         *
         * glyf 맞추기 
         *
         * @param {Array=} indexList 索引列表
         * @param {Object} setting 选项
         * @return {boolean}
         */
        Manager.prototype.adjustGlyf = function (indexList, setting) {

            var list = this.ttf.adjustGlyf(indexList, setting);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 设置glyf
         *
         * glyf 수정하기 
         *
         * @param {Object} setting 选项
         * @param {Array} index 索引
         * @return {boolean}
         */
        Manager.prototype.updateGlyf = function (setting, index) {

            var glyf = this.getGlyf([index])[0];
            var changed = false;

            // 유니코드 설정 
            if (setting.unicode.length) {
                glyf.unicode = setting.unicode;
                glyf.modify = 'edit';
                changed = true;
            }

            // 이름 설정 
            if (setting.name !== glyf.name) {
                glyf.name = setting.name;
                glyf.modify = 'edit';
                changed = true;
            }

            if (
                (undefined !== setting.leftSideBearing
                    && setting.leftSideBearing !== glyf.leftSideBearing)
                || (undefined !== setting.rightSideBearing
                    && setting.rightSideBearing + (glyf.xMax || 0) !== glyf.advanceWidth)
            ) {
                var list = this.ttf.adjustGlyfPos([index], setting);
                if (list.length) {
                    list.forEach(function (g) {
                        g.modify = 'edit';
                    });
                    changed = true;
                }
            }

            changed && this.fireChange(true);

            return this;
        };


        /**
         * 获取glyfList
         *
         * glyf 리스트 가지고 오기 
         *
         * @param {Array=} indexList 索引列表
         * @return {Array} glyflist
         */
        Manager.prototype.getGlyf = function (indexList) {
            return this.ttf.getGlyf(indexList);
        };

        /**
         * 设置名字和头部信息
         *
         * 폰트 설정 
         *
         * @param {Object} info 设置
         * @return {this}
         */
        Manager.prototype.setInfo = function (info) {
            this.ttf.setName(info);
            this.ttf.setHead(info);
            this.fireChange(true);
            return this;
        };

        /**
         * 设置度量信息
         * 
         * @param {Object} info 设置
         * @return {this}
         */
        Manager.prototype.setMetrics = function (info) {
            this.ttf.setHhea(info);
            this.ttf.setOS2(info);
            this.ttf.setPost(info);
            this.fireChange(true);
            return this;
        };

        /**
         * 优化字体
		 *
		 * 글자 최적화 
         *
         * @return {true|Object} 优化成功，或者错误信息
         */
        Manager.prototype.optimize = function () {

            var result = this.ttf.optimize();

            this.ttf.get().glyf.forEach(function (g) {
                g.modify = 'edit';
            });

            this.fireChange(true);

            if (true === result) {
                return true;
            }

            var message = '';
            if (result.repeat) {
                message = i18n.lang.msg_repeat_unicode + result.repeat.join(',');
            }

            return {
                repeat: result.repeat,
                message: message
            };
        };

        /**
         * 对字形按照unicode编码排序
         * 
         * glyf 정ㄹ렬하기 
         *
         * @return {true|Object} 优化成功，或者错误信息
         */
        Manager.prototype.sortGlyf = function () {

            var result = this.ttf.sortGlyf();

            if (result === -1) {
                return {
                    message: i18n.lang.msg_no_sort_glyf
                };
            }
            else if (result === -2) {
                return {
                    message: i18n.lang.msg_has_compound_glyf_sort
                };
            }

            if (result.length) {
                result.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }
            return true;
        };

        /**
         * 复合字形转简单字形
		 * 
		 * 복합 간단한 모양을 설정 모양
		 *
         * @param {Array=} indexList 选中的字形索引
         * @return {this}
         */
        Manager.prototype.compound2simple = function (indexList) {
            var result = this.ttf.compound2simple(indexList);
            if (result.length) {
                result.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }
            return this;
        };


        /**
         * 撤销
         * @return {this}
         */
        Manager.prototype.undo = function () {
            if (!this.history.atFirst()) {
                this.ttf.set(this.history.back());
                this.fireChange(false);
            }

            return this;
        };


        /**
         * 重做
         * @return {this}
         */
        Manager.prototype.redo = function () {
            if (!this.history.atLast()) {
                this.ttf.set(this.history.forward());
                this.fireChange(false);
            }

            return this;
        };

        /**
         * ttf是否被改变
         *
         * @return {boolean}
         */
        Manager.prototype.isChanged = function () {
            return !!this.changed;
        };

        /**
         * 设置状态
         *
         * 상태 저장하기 
         *
         * @param {string} state 状态值 new/saved
         * @return {this}
         */
        Manager.prototype.setState = function (state) {

            // new 면 이제 시작 된 것이기 때문에 변경여부를 설정하지 않는다. 
            if (state === 'new') {
                this.changed = false;
            }
            else if (state === 'saved') {
                // save 는 저장된 표시 모두 삭제한다. 
                this.ttf.get().glyf.forEach(function (g) {
                    delete g.modify;
                });

                this.fire('change', {
                    ttf: this.ttf.get(),
                    changeType: state
                });

                this.changed = false;
            }

            return this;
        };

        /**
         * 获取复制的glyf对象，这里会将复合字形转换成简单字形，以便于粘贴到其他地方
         *
         * Glyf 복사하기 
         *
         * @param {Array=} indexList 索引列表
         * @return {Array} glyflist
         */
        Manager.prototype.getCopiedGlyf = function (indexList) {
            var list = [];
            var ttf = this.ttf.get();
            for (var i = 0, l = indexList.length; i < l; ++i) {
                var index = indexList[i];
                var cloned = lang.clone(ttf.glyf[index]);
                if (ttf.glyf[index].compound) {
                    compound2simple(cloned, transformGlyfContours(ttf.glyf[index], ttf));
                }
                list.push(cloned);
            }
            return list;
        };

        Manager.prototype.clearGlyfTag = clearGlyfTag;

        /**
         * 设置状态
         * @return {this}
         */
        Manager.prototype.calcMetrics = function () {
            if (this.ttf) {
                return this.ttf.calcMetrics();
            }
        };

		Manager.prototype.isOTF = function () {
			return !!this.ttf.CFF;
		}

        /**
         * 注销
         */
        Manager.prototype.dispose = function () {
            this.un();
            delete this.ttf;
        };

        require('common/observable').mixin(Manager.prototype);

        return Manager;
    }
);
