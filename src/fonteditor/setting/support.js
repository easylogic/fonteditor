/**
 * @file 支持的setting集合
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var support = {
            editor: require('./editor'),
            'simple.editor': require('./simple-editor'),
            ie: require('./ie')
        };

        return support;
    }
);
