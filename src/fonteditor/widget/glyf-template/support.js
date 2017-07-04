/**
 * @file Glyf Name Template
 * @author easylogic(cyberuls@gmail.com)
 */

define(
    function (require) {
        return {
			make : function (type) {
				if (this[type])
				{
					return this[type].generate();
				} else {
					return [];	// 없으면 아무것도 만들지 않는다. 
				}
				
			},
			makeUnicodeGlyf: function (type, keys) {
				if (this[type])
				{
					return this[type].makeUnicodeGlyf(keys);
				} else {
					return [];	// 없으면 아무것도 만들지 않는다. 
				}
			},
			getCheckKeys: function (type) {
				if (this[type])
				{
					return this[type].getCheckKeys();
				} else {
					return [];	// 없으면 아무것도 만들지 않는다. 
				}
			},

			splitJaso: function (type, unicode) {
				if (this[type])
				{
					return this[type].splitJaso(unicode);
				} else {
					return [];	// 없으면 아무것도 만들지 않는다. 
				}
			},

            getSimilarGlyfName : function (type, name) {
                if (this[type]) {
                    return this[type].getSimilarGlyfName(name);
                } else {
                    return [];
                }
            },
			
            'KSC5601': require('./KSC5601')
        };
    }
);
