/**
 * @file 消息提示
 * @author easylogic(cyberuls@gmail.com)
 */

define(
    function (require) {
        return {
            msg_not_support_file_type: '지원하지 않는 파일 형식입니다!',
            msg_loading_pic: '그림 로딩중...',
            msg_read_pic_error: '그림을 읽는 도중 에러가 발생하였습니다....',
            msg_processing: '처리중입니다...',
            msg_input_pic_url: '그림 URL을 입력해주세요!',
            msg_no_glyph_to_import: '가져올 글자가 없습니다.',
            msg_error_read_file: '파일 읽기 실패',
            msg_loading: '로딩중...',
            msg_confirm_del_proj: '이 프로젝트를 지우시겠습니까?',
            msg_not_set_sync_info: '동기화 설정이 되지 않았습니다!',
            msg_no_sync_font: '동기화 할 것이 없습니다.',
            msg_repeat_unicode: 'Repeat unicode, glyph index are:',
            msg_confirm_del_glyph: '글자를 삭제하시겠습니까?',
            msg_read_file_error: '파일 읽다가 에러가 났어요!',
            msg_syncing: '동기화중...',
            msg_sync_success: '동기화 성공...',
            msg_sync_failed: '동기화 실패：',
            msg_confirm_save_proj: '창을 닫기 전에 현재 프로젝트를 저장하시겠습니까?',
            msg_save_success: '성공적으로 저장하였습니다....',
            msg_save_failed: '저장에 실패하였습니다...',
            msg_input_proj_name: '프로젝트 이름을 넣어주세요：',
            msg_confirm_gen_names: 'Glyph 이름은 새로 만들어질 것입니다. 새로 만들까요?',
            msg_not_support_compound_glyf: 'Not support compound glyph currently!',
            msg_transform_compound_glyf: 'Do you want to transform compound glyf to simple glyf?',
            msg_confirm_save_glyph: '글자를 수정 중입니다. 변경된 것을 취소하시겠습니까?',
            msg_no_related_glhph: '연관된 글자를 못찾았어요!',
            msg_error_open_proj: 'Open project error, do you want to delete this project?',
            msg_error_del_proj: 'Delete project error, please refresh this page and try delete again!',
            msg_no_sort_glyf: '정렬 할 글자가 없어요!',
            msg_has_compound_glyf_sort: 'Can\'t sort glyphs while contains compound glyph.',

            preview_title: ' {%=fontFormat%} 포맷 폰트 미리보기',
            preview_first_step: 'Step 1: font-face 를  `{%=fontFamily%}`로 사용한다.',
            preview_second_step: 'Step 2：`{%=fontFamily%}` 로 css 스타일을 정의한다. .',
            preview_third_step: 'Step 3：웹페이지에서 아이콘을 위한 폰트 유니코드를 설정한다.',

            msg_error_sync_font: 'Get sync font error!',
            msg_error_sync_font_address: 'Font sync address not available!',
            msg_has_new_font_version: 'Font `${fontName}` has new version, update now?',
            msg_error_sync_font_version: 'Sync new font version error!'
        };
    }
);
