/**
 * @file Simple Default Option 
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var editorDefault = require('editor/simple-options').editor;

        var setting = {

            saveSetting: true, // 是否保存setting

            // 뷰어 옵션
            viewer: {
                color: '', // 查看器颜色
                shapeSize: 'small', // 字形大小
                pageSize: 100 // 翻页大小
            },

            // 编辑器选项
            // see : editor/options.editor
            editor: {
                sorption: {
                    enableGrid: false,
                    enableShape: true
                },
                fontLayer: {
                    strokeColor: editorDefault.fontLayer.strokeColor,
                    fill: true,
                    fillColor: editorDefault.fontLayer.fillColor
                },
                referenceline: {
                    style: {
                        strokeColor: editorDefault.referenceline.style.strokeColor
                    }
                },
                axis: {
                    showGrid: true,   // 그리드 보기 
                    gapColor: editorDefault.axis.gapColor, // 중간 선 색깔 
                    metricsColor: editorDefault.axis.metricsColor,  // 좌표 색깔 
                    graduation: {   // 윤곽선 
                        gap: editorDefault.axis.graduation.gap
                    }
                }
            }
        };

        return setting;
    }
);
