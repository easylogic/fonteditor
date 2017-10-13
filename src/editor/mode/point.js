/**
 * @file 点编辑模式
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var lang = require('common/lang');

        // 移动步频
        var stepMap = {
            left: [-1, 0],
            right: [1, 0],
            up: [0, -1],
            down: [0, 1]
        };

        var stepMapForShift = {
            left: [-10, 0],
            right: [10, 0],
            up: [0, -10],
            down: [0, 10]
        };

        var stepMapForControl = {
            left: [-50, 0],
            right: [50, 0],
            up: [0, -50],
            down: [0, 50]
        };



        function onContextMenu(e) {
            if (!this.curPoint && !this.curPoints) {
                return;
            }

            if (e.returnValue === false) {
                return;
            }

            this.contextMenu.hide();

            var command = e.command;
            var shape = this.curShape;
            var points = shape.points;


            if (command === 'add' && this.curPoint) {
	            var pointId = +this.curPoint.pointId;
				// 1 ~ 5 키까지 점추가  (1 은 1개, 5는 5개 중간점 추가)
				// shift + 1 ~ 5 키까지  곡선 점 추가 
				// alt + 1 ~ 5 키까지  랜덤 곡선 점 추가 (짝수번째 곡선 점, 홀수번째 직선 점) 

				var isCurve = typeof e.isCurve == 'undefined' ? true : e.isCurve;
				var isRandom = e.isRandom; 

				// 추가해야할 점의 개수 
				var count = e.count || 1; 

				// 두 점사이 나누는 공간의 수 (추가 해야할 점이 1이면 2칸을 나눠야 중간으로 옴) 
				var divCount = count + 1; 

				// 현재 포지션 설정 
				var args = [pointId + 1, 0];

				var cur = points[pointId];
				var next = points[pointId === points.length - 1 ? 0 : pointId + 1];

				// 점 표시할 거리 구하기 
				var distX = Math.abs(cur.x - next.x) / divCount;  
				if (cur.x > next.x ) { distX = -1 * distX;  }

				var distY = Math.abs(cur.y - next.y) / divCount;  
				if (cur.y > next.y ) { distY = -1 * distY;  }

				// 나누는 숫자만큼 점 추가 
				for(var i = 1; i <= count; i++) {

					var onCurve = isCurve; 
					
					if (isRandom)
					{
						if (i % 2 == 0) {
							onCurve = true; 
						} else {
							onCurve = false; 
						}
					}

					var p = {
						x: cur.x + (distX * i),
						y: cur.y + (distY * i),
						onCurve: onCurve
					};

					args.push(p);	// 점 개수만큼 더하기 
				}

				// 원하는 개수만큼 점 추가하기 
				Array.prototype.splice.apply(points, args);
                //points.splice(pointId + 1, 0, p);
            }
            else if (command === 'remove') {
				if (this.curPoint)
				{
		            var pointId = +this.curPoint.pointId;
	                points.splice(pointId, 1);
				} else if (this.curPoints && this.curPoints.length) {
					var curPoints = this.curPoints; 
					shape.points = points.filter(function(p, i) {
						return 0 == curPoints.filter(function (cp) {
							return cp.pointId == i; 
						}).length ;
					});
				}


            }
            else if (command === 'onCurve' && this.curPoint) {
	            var pointId = +this.curPoint.pointId;
                points[pointId].onCurve = true;
            }
            else if (command === 'offCurve' && this.curPoint) {
	            var pointId = +this.curPoint.pointId;
                delete points[pointId].onCurve;
            }
            else if (command === 'asStart' && this.curPoint) {
	            var pointId = +this.curPoint.pointId;
                shape.points = points.slice(pointId).concat(points.slice(0, pointId));
            }
            else if (this.supportCommand(command)) {
                this.execCommand(command);
                return;
            }

            refreshControlPoints.call(this, shape);

            delete this.curPoint;
            this.fontLayer.refresh();
            this.fire('change');
        }


        function refreshControlGuideLine(type) {
            var coverLayer = this.coverLayer;
			var controls = coverLayer.filterShape(function(shape) {
				return shape.isControl;
			});

			var arr = [];
			controls.forEach(function(c) {
				arr[c.pointId] = c; 
			});

			coverLayer.filterShape(function(shape) {
				return shape.type == 'line' && shape.point0Id != undefined && shape.point1Id != undefined;
			}).forEach(function (shape) {
				var p0 = arr[shape.point0Id];
				var p1 = arr[shape.point1Id];

				shape.p0 = { x : p0.x, y : p0.y }
				shape.p1 = { x : p1.x, y : p1.y }
			});

            coverLayer.refresh();
        }

        function refreshControlPoints(shape, pointIndexList) {
            var controls = [];
			pointIndexList = pointIndexList || [];
            var last = shape.points.length - 1;
            var clonedShape = lang.clone(shape);

            var style = this.options.coverLayer;

			var lineStyle = {
				fill : false,
				stroke : true,
				strokeWidth: 2,
				strokeColor: style.strokeColor
			}

			var guideLineStyle = {
				stroke: true,
				strokeColor: style.strokeColor
			}

			var startPointStyle = this.options.pointColor.start;
			var endPointStyle = this.options.pointColor.end;
			var middlePointStyle = this.options.pointColor.middle;

            clonedShape.id = 'cover-' + shape.id;
            clonedShape.selectable = false;
            clonedShape.style = {
                strokeColor: middlePointStyle.outlineColor
            };
			
			clonedShape.points.forEach(function (p, index) {

				var current = p.current; 
				
				if (pointIndexList.indexOf(index) >= 0) {
					p.current = true; 
				}

				var cpoint = {
					type: p.onCurve ? 'point' : 'cpoint',
					x: p.x,
					y: p.y,
					isControl : true, 
					point: p,
					pointId: index,
					style: {
						fill: true,
						stroke: true,
						strokeColor: middlePointStyle.strokeColor,
						fillColor: p.current ? middlePointStyle.outlineColor : middlePointStyle.fillColor
					}
				};

				if (index === 0 && !p.current) {
					cpoint.style.strokeColor = startPointStyle.strokeColor;
					cpoint.style.fillColor = startPointStyle.fillColor;
					cpoint.style.strokeWidth = startPointStyle.stroke;
				}
				else if (index === last && !p.current) {
					cpoint.style.strokeColor = endPointStyle.strokeColor;
					cpoint.style.fillColor = endPointStyle.fillColor;
					cpoint.style.strokeWidth = endPointStyle.stroke;
				}

				controls.push(cpoint);

				if (cpoint.type == 'cpoint')   //  커브일 때 가이드 선을 그림 
				{

					if (cpoint.point.type)
					{
						if (cpoint.point.indexType == 'c1')
						{
							var clineIndex = index == 0 ? last-1 : index - 1; 

							var p0 = clonedShape.points[clineIndex];
							var p1 = clonedShape.points[index];
							var p2 = clonedShape.points[index+1];
							var p3 = clonedShape.points[index+2];

							var cline = {
								type : 'line', 
								dashed : true, 
								notScaled : true, 
								point0Id : clineIndex, 
								point1Id : index,
								p0 : {
									x : p0.x,
									y : p0.y
								},
								p1 : {
									x : p1.x,
									y : p1.y
								},
								style: guideLineStyle
							}

							controls.push(cline);  // 왼쪽 

							var cline2 = {
								type : 'line', 
								dashed : true, 
								notScaled : true, 
								point0Id : index+1, 
								point1Id : index+2,
								p0 : {
									x : p2.x,
									y : p2.y
								},
								p1 : {
									x : p3.x,
									y : p3.y
								},
								style: guideLineStyle
							}

							controls.push(cline2); //오른 쪽 

						}

					} else {
						var clineIndex = index == 0 ? last : index-1; 
						var clineIndex2 = index == last ? 0 : index+1; 

						var p0 =  clonedShape.points[index];
						var p1 =  clonedShape.points[clineIndex];
						var p2 =  clonedShape.points[clineIndex2];

						var cline = {
							type : 'line', 
							dashed : true, 
							notScaled : true, 
							point0Id : index, 
							point1Id : clineIndex,
							p0 : {
								x : p0.x,
								y : p0.y
							},
							p1 : {
								x : p1.x,
								y : p1.y
							},
							style: guideLineStyle
						}

						controls.push(cline);  // 왼쪽 

						var cline2 = {
							type : 'line', 
							dashed : true, 
							notScaled : true, 
							point0Id : index, 
							point1Id : clineIndex2,
							p0 : {
								x : p0.x,
								y : p0.y
							},
							p1 : {
								x : p2.x,
								y : p2.y
							},
							style: guideLineStyle
						}

						controls.push(cline2); //오른 쪽 
					}

					
				}

			});




            var coverLayer = this.coverLayer;

            coverLayer.clearShapes();

            // 添加轮廓
            coverLayer.addShape(clonedShape);
            // 添加控制点
            controls.forEach(function (shape) {
                coverLayer.addShape(shape);
            });

            this.curShape = shape;
            coverLayer.refresh();
        }

        var mode = {

			type : 'point',



            down: function (e) {

                // 恢复原来样式
                if (this.curPoint) {
                    if (this.curPoint._style) {
                        this.curPoint.style = lang.clone(this.curPoint._style);
                    }
					delete this.curPoint.current;	// 기존의 current 속성 삭제 

                }

                delete this.curPoint;

                var result = this.coverLayer.getShapeIn(e);

                if (result) {
                    this.curPoint = result[0];
                    this.curPoint._style = lang.clone(this.curPoint.style);
                    this.curPoint.style.fillColor = this.options.coverLayer.outlineColor;
					this.curPoint.current = true; 
					delete this.curPoints;

                    // 设置吸附选项
                    if (this.sorption.isEnable()) {

                        if (this.sorption.enableShape) {

                            var xAxisArray = [];
                            var yAxisArray = [];

                            // 过滤需要吸附的对象
                            this.curShape.points.forEach(function (p) {
                                xAxisArray.push(p.x);
                                yAxisArray.push(p.y);
                            });

                            // 添加参考线
                            var referenceLines = this.referenceLineLayer.shapes;
                            referenceLines.forEach(function (shape) {
                                if (undefined !== shape.p0.x) {
                                    xAxisArray.push(shape.p0.x);
                                }
                                if (undefined !== shape.p0.y) {
                                    yAxisArray.push(shape.p0.y);
                                }
                            });

                            this.sorption.clear();
                            xAxisArray.length && this.sorption.addXAxis(xAxisArray);
                            yAxisArray.length && this.sorption.addYAxis(yAxisArray);
                        }
                    }

					if(this.curPoint) {
						var current = this.curPoint;
						if (current.point)
						{
							current.point.x = current.x;
							current.point.y = current.y;

							var origin = this.getOriginalPoint(current.point);

							current.point.originX = origin.x;
							current.point.originY = origin.y;
						}

					}



					refreshControlGuideLine.call(this);
                    //this.coverLayer.refresh();

					this.fire('refreshPoint');
                } else {
					this.isRangeMode = true; 
					this.setMode('range', 'point');
				}
            },


            drag: function (e) {

                var camera = this.render.camera;
                if (this.curPoint) {
                    var current = this.curPoint;
                    var reserved = this.curShape.points[current.pointId];

					if (!reserved)
					{
						return;
					}

                    if (camera.event.altKey) {
                        current.x = reserved.x;
                    }
                    else {
                        current.x = reserved.x + camera.event.deltaX;
                    }

                    if (camera.event.shiftKey) {
                        current.y = reserved.y;
                    }
                    else {
                        current.y = reserved.y + camera.event.deltaY;
                    }

                    if (this.sorption.isEnable()) {
                        var result;

                        if (result = this.sorption.detectX(current.x)) {
                            current.x = result.axis;
                        }

                        if (result = this.sorption.detectY(current.y)) {
                            current.y = result.axis;
                        }
                    }

                    current.point.x = current.x;
                    current.point.y = current.y;

					var origin = this.getOriginalPoint(current.point);

					current.point.originX = origin.x;
					current.point.originY = origin.y;

                    //this.coverLayer.refresh();

					refreshControlGuideLine.call(this, 'drag');

					this.fire('refreshPoint');
                }
            },

            dragend: function () {
                if (this.curPoint && this.curPoint.x) {
                    var reserved = this.curShape.points[this.curPoint.pointId];
                    reserved.x = this.curPoint.x;
                    reserved.y = this.curPoint.y;

                    if (this.sorption.isEnable()) {
                        this.sorption.clear();
                    }

                    this.fontLayer.refresh();
                }
                this.fire('change');
            },


            move: function (e) {
                var shape = this.coverLayer.getShapeIn(e);
                if (shape) {
                    this.render.setCursor('pointer');
                }
                else {
                    this.render.setCursor('default');
                }
            },


            rightdown: function (e) {
				// 왠만하면 오른쪽 안누르고 할 수 있도록 하자. 
                if (this.curPoint) {
                    this.contextMenu.onClick = lang.bind(onContextMenu, this);
                    this.contextMenu.show(e, require('../menu/commandList').point);
                }
            },

			command : function (editor, e) {
				onContextMenu.call(editor, {
	                command: e.command,
					count : e.count,
					isCurve : e.isCurve,
					isRandom : e.isRandom 
                });
			},


            keyup: function (e) {


                // esc键，重置model
                if (e.key === 'delete' && (this.curPoint || this.curPoints)) {
                    onContextMenu.call(this, {
                        command: 'remove'
                    });
                }
				// 1 ~ 5 까지 키 누른만큼 point 추가 하기 
                else if (e.keyCode >= 49 && e.keyCode <= 53 && this.curPoint) {
                    onContextMenu.call(this, {
                        command: 'add',
						count : e.keyCode - 48,	// 48 은  `0`의 ascii 코드
						isCurve : !e.shiftKey,
						isRandom : e.altKey
                    });
                } else if (e.key == 'C' && this.curPoint) {		// `C`를 누르면 curve 인지 아닌지 변경한다. 
					var current = this.curPoint;
                    var reserved = this.curShape.points[current.pointId];

					if (reserved.onCurve)
					{
						onContextMenu.call(this, {
							command: 'offCurve'
						});
					} else {
						onContextMenu.call(this, {
							command: 'onCurve'
						});
					}

                }
                // 移动
                else if (stepMap[e.key] && this.curPoint) {
                    this.fire('change');
                } else if (stepMap[e.key] && this.curPoints) {
                    this.fire('change');
                }
                else if (e.key === 'esc') {			// point 모드 해제 
                    this.setMode();
                }
            },


            keydown: function (e) {
				// 화살표로 점 이동하기 
				// 기본 스텝 1 
				// shift 를 누른채로 움직이면 스텝 5 적용 (좀 더 빠르게, 멀리 움직일 수 있다.)
                if (stepMap[e.key] && this.curPoint) {
                    var step = stepMap[e.key];
					
					if (e.ctrlKey)  { step = stepMapForControl[e.key]; }
					else if (e.shiftKey)  { step = stepMapForShift[e.key]; }
					
                    var current = this.curPoint;

                    if (step[0]) {
                        current.x += step[0];
                    }

                    if (step[1]) {
                        current.y += step[1];
                    }

                    var reserved = this.curShape.points[current.pointId];
                    reserved.x = current.point.x = current.x;
                    reserved.y = current.point.y = current.y;

                    //this.coverLayer.refresh();
					
					refreshControlGuideLine.call(this);
                    this.fontLayer.refresh();
                } 

				if (stepMap[e.key] && this.curPoints && this.curPoints.length) {
                    var step = stepMap[e.key];
					
					if (e.ctrlKey)  { step = stepMapForControl[e.key]; }
					else if (e.shiftKey)  { step = stepMapForShift[e.key]; }

					var me = this; 
					this.curPoints.forEach(function(current) {
						if (step[0]) {
							current.x += step[0];
						}

						if (step[1]) {
							current.y += step[1];
						}

						var reserved = me.curShape.points[current.pointId];
						reserved.x = current.point.x = current.x;
						reserved.y = current.point.y = current.y;

					});

                    //this.coverLayer.refresh();
					
					refreshControlGuideLine.call(this);
                    this.fontLayer.refresh();
                } 
            },


            begin: function (shape, points) {
				this.isRangeMode = false; 
                var me = this;
                refreshControlPoints.call(me, shape, points || []);		// 컨트롤 포인트 다시 그리기 

				// 선택된 점 표시 
				if (points && points.length)
				{
					delete this.curPoint;
					this.curPoints = points.map(function(index) { 
						var coverShape = me.coverLayer.shapes.filter(function(s) {
							return s.pointId == index; 	
						});

						var point = coverShape[0];
						point.current = true; 

						return point; 
					});
				}
            },

			refresh : function () {

				if (this.curShape)
				{
					var me = this;
					refreshControlPoints.call(me, this.curShape);		// 컨트롤 포인트 다시 그리기 
				}

			},


            end: function () {

				if (!this.isRangeMode)
				{
					delete this.curPoint;
					delete this.curPoints;
					delete this.curShape;

					this.coverLayer.clearShapes();
					this.coverLayer.refresh();
					this.render.setCursor('default');

				} 
            }
        };

        return mode;
    }
);
