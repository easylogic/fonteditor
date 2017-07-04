/**
 * @file 语言字符串管理
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var I18n = require('common/I18n');

        return new I18n(
            [
                ['zh-cn', require('./zh-cn/editor')],
                ['en-us', require('./en-us/editor')],
                ['ko-kr', require('./ko-kr/editor')],

                ['zh-cn', require('./zh-cn/message')],
                ['en-us', require('./en-us/message')],
                ['ko-kr', require('./ko-kr/message')],

                ['zh-cn', require('./zh-cn/dialog')],
                ['en-us', require('./en-us/dialog')],
                ['ko-kr', require('./ko-kr/dialog')]
            ],
            window.language
        );
    }
);
