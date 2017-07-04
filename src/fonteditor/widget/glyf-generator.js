/**
 * @file 글리프 이름 생성기
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var template = require('./glyf-template/support');

        /**
         * 템플릿 기반으로 glyf 이름을 생성하고 만든다. 
         *
         * @param {String} type  glyf name template type
         *
         * @return {Array}  Glyf Name List
         */
        function generateGlyfNameForTemplate(type) {
			type = type || 'KSC5601';

			return template.make(type);
        }

        function makeUnicodeGlyfForTemplate(type, keys) {
			type = type || 'KSC5601';

			return template.makeUnicodeGlyf(type, keys);
        }

        function getCheckKeys(type) {
			type = type || 'KSC5601';

			return template.getCheckKeys(type);
        }

		function splitJaso (type, unicode) {

			type = type || 'KSC5601';

			return template.splitJaso(type, unicode);
		}

        function getSimilarGlyfName (type, name) {
            type = type || 'KSC5601';

            return template.getSimilarGlyfName(type, name);
        }


        var generator = {
            'generate': generateGlyfNameForTemplate,
			'makeUnicodeGlyf' : makeUnicodeGlyfForTemplate,
			'getCheckKeys': getCheckKeys,
			'splitJaso' : splitJaso,
            'getSimilarGlyfName': getSimilarGlyfName
        };

        return generator;
    }
);
