/**
 * 심플모드 옵션 
 * 
 * @file simple-options
 * @author mengke01(kekee000@gmail.com)
 */
define(
    function (require) {
        var options = {

            // 编辑器相关
            editor: {

				simple : true,

                unitsPerEm: 1024, // 框大小, 상자크기? 

                // 吸附选项  (그리드에 붙이기, 자석효과)
                sorption: {
                    enableGrid: true, // 吸附到网格
                    enableShape: true, // 吸附到对象
                    gridDelta: 5, // 网格delta
                    delta: 5, // 对象delta
                    sorptionColor: '#ff0000',	// 그리드 붙이기 할 때 가이드 선 색깔 
                    sorptionLineWidth : 2, 
                    sorptionFont : "normal 12px arial" 
                },

                // 辅助线
                referenceline: {
					hide: true,		// reference line(가이드선) 영역 보이기 여부 
                    style: {
						thin: true,
                        strokeColor: '#939300',
						fillColor: '#939300'
                    }
                },

                // 객체 선택시 나타나는 컬러 설정 
                coverLayer: {
					thin: true,
					font : "normal 12px arial",
                    lineColor: '#4a90e2',
                    outlineColor: '#115e16',
					thin : true,
                    strokeColor: '#4a90e2',
                    fillColor: 'rgba(255, 255, 255, 0.4)'		// 점 포인트 색상 
                },

                // 글자 설정 
                fontLayer: {
					thin: true,
                    lineWidth: 1,
                    strokeColor: 'rgba(255, 255, 255, 0.5)',		// 폰트 border 색상 
                    fill: true,
                    fillColor: 'rgba(255, 255, 255, 0.8)'			// 폰트 채움 색상 , 랜덤 컬러
                },

                // 轴线
                axis: {
					simple: true, 
					hide: true,	// axis 보이기 여부 
                    showGrid: true, // 격자 표시 여부 
                    gapColor: 'rgba(100, 100, 100, 0.3)', // 그리드 선 색상
                    axisColor: 'rgba(200, 200, 200, 1)',
                    metricsColor: 'rgba(255, 0, 0, 0.9)', // 측정 가이드 색상
                    metricsTextColor: '#993300', // 측정 가이드 색상
                    emColor: '#993300', // em 프레임 색상			// descent, capHeight 등 metrics 기준 선 표시 색상 
					font : 'normal 11px arial',
					thin : true,

                    // 字体测量规格
					hideMetrics : false,
                    metrics: {
                        ascent: 824, // 上升
                        descent: -200, // 下降
                        xHeight: 700, // x高度
                        capHeight: 800 // 大写字母高度
                    },

                    // 줄자
                    graduation: {
						strokeColor: '#330033',
                        gap: 50,		// 줄자 표시 간격 
						dist : 0,  // 50 * 4 = 200  단위로 글자 표시 
                        thickness: 1, // 줄자 그리기 간격 
                        markHeight: 5, // 标记高度
                        markBackgroundColor: '#ffffff', // 背景色
                        markColor: '#006633', // 前景色
                        color: '#990000', // 글자색,
						font : 'normal 13px arial',
						thin : true
                    },

					style: {
						fillColor: '#4a90e2',
						strokeColor : '#4a90e2',
						font: 'normal 13px arial',
						thin : true
					}
                },
                // 命令栏
                contextMenu: {}
            },


            // 渲染器相关
            render: {
				painter : {
					simple : true 
				},
                defaultRatio: 1.25, // 기본 크기 조정		1 
                minScale: 0.1, // 최소 크기(줌)
                maxScale: 200, // 최대 크기(줌)
                enableScale: true, // 확장 가능 여부
                enableResize: true // 크기 조정 가능 여부	false 
            }
        };
        return options;
    }
);
