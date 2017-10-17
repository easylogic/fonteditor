/**
 * @file dialog.js
 * @author easylogic(cyberuls@gmail.com)
 */

define(
    function (require) {
        return {
            dialog_savesetting: '설정 저장',
            dialog_resetsetting: '기본 설정으로 리셋',

            dialog_no_input: 'No Input!',
            dialog_adjust_glyph: 'Adjust Glyph',
            dialog_reduce_glyph: '글자 줄이기',
            dialog_glyph_info: '글자 정보',
            dialog_similar_glyf: '비슷한 글자들',
            dialog_points_info: '포인트 정보',
			dialog_color_palette: 'Color Palette',
			dialog_shape_info: 'Symbol',
            dialog_adjust_pos: 'Adjust Glyph Position',

            dialog_scale_to_bound: 'Scale to Ascent and Descent',
            dialog_set_unicode: '유니코드를 넣어주세요.',

            dialog_top_bottom_padding: '위 아래 여백',

            dialog_find_glyf_by_unicode: '유니코드로 글자 찾기',
            dialog_find_glyf_by_name: '이름으로 글자 찾기',
            dialog_find_glyf_by_index: 'Index로 글자 찾기',
            dialog_find_glyf_example: '예제: 유니코드："$21", 글자 이름： "uniE001", Index："5"',


            dialog_editor_setting: '에디터 설정',
            dialog_editor_viewercolor: '글자 색깔',
            dialog_editor_fontsize: '폰트 사이즈',
            dialog_editor_fontsize_xlarge: '아주 큼',
            dialog_editor_fontsize_large: '큼',
            dialog_editor_fontsize_normal: '기본',
            dialog_editor_fontsize_small: '작음',
            dialog_editor_pageSize: '페이지 사이즈',
            dialog_editor_gridsorption: 'Grid에 붙임',
            dialog_editor_shapesorption: '외곽선에 붙임',
            dialog_editor_showgrid: 'Grid 보기',
            dialog_editor_fillcontour: '윤곽 채우기',
            dialog_editor_contourstrokecolor: '윤곽선 색상',
            dialog_editor_contourfillcolor: '윤곽 채움 색상',
            dialog_editor_gapcolor: 'Gap 색상',
            dialog_editor_gap: 'Gap 사이즈',
            dialog_editor_metricscolor: 'Metrics 색상',

            dialog_glyf_unicode_example: ' &nbsp;&nbsp; 멀티 유니코드 지원, 예제："$21,$22,$23"',

            dialog_unicode_set: '유니코드 설정',
            dialog_unicode_start: '시작 유니코드',
            dialog_generage_name: 'Glyph 이름 생성하기',

            dialog_metrics: 'Metrics',

            dialog_import_and_export: '불러오기 , 내보내기',

            dialog_combine_svg_single_glyph: 'Glyph 에 svg 합치기',
            dialog_save_with_glyf_name: '폰트 내보낼때 glyph 이름 저장하기',

            dialog_onlinefont: '온라인 폰트',

			dialog_erase: '지우개 모드',
            dialog_import_pic: '이미지 추가하기',
            dialog_fonturl: '폰트 URL',
            dialog_picurl: '이미지 URL',
            dialog_picurl_load_title: '사진 URL 설정하기',
            dialog_picurl_load: 'URL로부터 사진 넣기',
            dialog_adjustwindow: 'Window 조정',
            dialog_showorigin: 'Show Origin',
            dialog_showcontour: '윤과선 보기',
            dialog_choosepic: '이미지 선택하기',
            dialog_choosepic_tip: 'jpg,gif,png,bmp,svg',
            dialog_preprocess: 'Pre Process',
            dialog_reverse: 'Reverse',
            dialog_gaussblur: 'Gauss Blur',
            dialog_contrast: 'Contrast',
            dialog_contour: '윤곽선',
            dialog_binarize_threshold: 'Binarize Threshold',
            dialog_threshold_default: '기본',
            dialog_threshold_mean: 'Mean',
            dialog_threshold_minimum: '최소',
            dialog_threshold_intermodes: '중간모드',
            dialog_threshold_ostu: 'Ostu',
            dialog_threshold_isodata: 'ISODATA',
            dialog_pic_smooth: '부드럽게',
            dialog_pic_open: '열기',
            dialog_pic_close: '닫기',
            dialog_pic_dilate: 'Dilate',
            dialog_pic_enrode: 'Enrode',

            dialog_export_glyf: '글자 내보내기',
            dialog_glyf_name: '글자 이름',
            dialog_color: '색깔',
            dialog_size: '사이즈',
            dialog_download_svg: 'SVG 다운로드',
            dialog_download_png: 'PNG 다운로드',

            dialog_alert_set_sync_name: '동기화 이름을 설정해주세요!',
            dialog_alert_set_url_or_syncurl: '동기화 URL 이나 push URL을 설정해주세요.',
            dialog_alert_set_sync_url: '동기화 url 을 설정해주세요.!',
            dialog_alert_set_filetype: '적어도 한개의 폰트 타입을 설정해주세요!',
			dialog_alert_validate_unicode: '코드 포인트가 올바르게 설정해주세요!'
        };
    }
);
