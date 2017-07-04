/**
 * @file Inner Dialog
 * @author easylogic(cyberuls@gmail.com)
 */

define(
    function (require) {
        return {
            'glyf-info': require('./setting-glyf'),
			'points' : require('./setting-points'),
			//'color-palette' : require('./setting-color-palette'),			// 이건 나중에 COLR 테이블 구성하면 다시 살리자. 
			'shape-maker' : require('./setting-shape-maker')
        };
    }
);
