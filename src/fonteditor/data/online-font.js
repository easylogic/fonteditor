/**
 * @file 在线字体列表
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        return [ // 외부에 있는 오픈소스 폰트에 대한 리스트를 구성하도록 하자.  서버에서 목록을 불러와도 된다. 
            {
                name: 'Font-Awesome Icons',
                url: 'http://www.bootcss.com/p/font-awesome/assets/font/fontawesome-webfont.woff',
                from: 'fontawesome'
            },
            {
                name: 'Baidu Mobile Icons',
                url: 'http://m.baidu.com/static/index/iconfont/iconfont_78d9aaf6.woff',
                from: 'baidu'
            },
            {
                name: 'Baidu Health Icons',
                url: 'http://vs-static.baidu.com'
                    + '/m-health/new-composite/asset/common/css/font/baiduHealth.woff',
                from: 'baidu'
            },
            {
                name: 'Baidu Medical Icons',
                url: 'http://vs-static.baidu.com'
                    + '/m-health/med-detail/201412301413/asset/common/css/fonts/fonteditor.woff',
                from: 'baidu'
            },
            {
                name: 'Baidu Education Icons',
                url: 'http://vs-static.baidu.com/edu/m/asset/common/css/font/i-edu.woff',
                from: 'baidu'
            }
        ];
    }
);
