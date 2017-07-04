/**
 * @file 相关配置
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var readOnlineUrl = location.hostname.indexOf('baidu.com') >= 0
        ? '/font/proxy?type=${0}&url=${1}'
        : './php/readOnline.php?type=${0}&file=${1}';

    // 用于form同步的代理页面地址
    var proxyUrl = function () {
        var a = document.createElement('a');
        a.href = 'proxy.html';
        return a.href;
    }();

    return {
        readOnline: readOnlineUrl,
        proxyUrl: proxyUrl
    };
});
