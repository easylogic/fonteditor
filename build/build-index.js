/**
 * @file 编译首页文件，编译为中文版和英文版
 * @author mengke01(kekee000@gmail.com)
 */
var fs = require('fs');
var path = require('path');

/**
 * 字符串格式化，支持如 ${xxx.xxx} 的语法
 * @param {string} source 模板字符串
 * @param {Object} data 数据
 * @return {string} 格式化后字符串
 */
function format(source, data) {
    return source.replace(/\$\{([\w.]+)\}/g, function ($0, $1) {
        var ref = $1.split('.');
        var refObject = data;
        var level;

        while (refObject != null && (level = ref.shift())) {
            refObject = refObject[level];
        }

        return refObject != null ?  refObject : '';
    });
}


/**
 * 빌드 시작
 */
function main(version) {
    var baseDir = path.dirname(__dirname);
    var tpl = String(fs.readFileSync(baseDir + '/index.tpl'));
    tpl = tpl.replace(/\s+/g, ' ');

    var tpl2 = String(fs.readFileSync(baseDir + '/simple.tpl'));
    tpl2 = tpl2.replace(/\s+/g, ' ');

    var i18n = {};
    i18n.lang = require('./i18n.zh-cn');
    var fileContent = format(tpl, i18n);
    fs.writeFileSync(baseDir + '/index-cn.html', fileContent);
    
    fileContent = format(tpl2, i18n);
    fs.writeFileSync(baseDir + '/simple-cn.html', fileContent);

    i18n.lang = require('./i18n.en-us');
    fileContent = format(tpl, i18n);
    fs.writeFileSync(baseDir + '/index-en.html', fileContent);

    fileContent = format(tpl2, i18n);
    fs.writeFileSync(baseDir + '/simple-en.html', fileContent);

    i18n.lang = require('./i18n.ko-kr');
    fileContent = format(tpl, i18n);
    fs.writeFileSync(baseDir + '/index.html', fileContent);

    fileContent = format(tpl2, i18n);
    fs.writeFileSync(baseDir + '/simple.html', fileContent);
}

main.apply(null, process.argv.slice(2));
