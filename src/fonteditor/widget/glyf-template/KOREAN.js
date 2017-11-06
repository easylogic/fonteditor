/**
 * @file KOREAN Name Template
 * @author easylogic(cyberuls@gmail.com)
 */

define(
    function (require) {


		function convertObject (arr, startIndex) {
			var obj = {};
			startIndex = startIndex || 0; 

			arr.forEach(function(item, i) {
				obj[item] = i + startIndex; 
			});

			return obj; 
		}

		var GLYFConstant = require('./constant');

		var cho_arr = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
		var jung_arr = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
		var jong_arr = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'.split('');
		
        var jungsung_1_arr = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅣ'.split('');
        var jungsung_2_arr = 'ㅗㅛㅜㅠㅡ'.split('');
        var jungsung_3_arr = 'ㅘㅙㅚㅝㅞㅟㅢ'.split('');

		var codeByChoSung = convertObject(cho_arr);
		var codeByJungSung = convertObject(jung_arr);
		var codeByJongSung = convertObject(jong_arr);	// 종성은 ㄱ 인덱스가 1부터 시작 

		// 
		var johap_arr = {
			'type1' : {
				cho: cho_arr.slice(),
				jung: jungsung_1_arr.slice()
			},
			'type2' : {
				cho: cho_arr.slice(),
				jung: jungsung_2_arr.slice()
			},
			'type3' : {
				cho: cho_arr.slice(),
				jung: jungsung_3_arr.slice()
			},
			'type4' : {
				cho: cho_arr.slice(),
				jung: jungsung_1_arr.slice(),
				jong: jong_arr.slice()
			},
			'type5' : {
				cho: cho_arr.slice(),
				jung: jungsung_2_arr.slice(),
				jong: jong_arr.slice()
			},
			'type6' : {
				cho: cho_arr.slice(),
				jung: jungsung_3_arr.slice(),
				jong: jong_arr.slice()
			}

		};

		function createChoSungName(type, list) {
			return cho_arr.map(function(ch) {
				return GLYFConstant.KOREAN + type + '-1-'+ch;
			});
		}

		function createJungSungName(type, list) {
			return jung_arr.map(function(ch) {
				return GLYFConstant.KOREAN + type + '-2-'+ch;
			});
		}

		function createJongSungName(type, list) {
			return jong_arr.map(function(ch) {
				return GLYFConstant.KOREAN + type + '-3-'+ch;
			});
		}



		function createChoSungCode(c) {
			return (codeByChoSung[c] || 0) * 588;
		}

		function createJungSungCode(c) {
			return (codeByJungSung[c] || 0) * 28;
		}

		function createJongSungCode(c) {
			return codeByJongSung[c] || 0;
		}

		function createUnicode(cho, jung, jong) {
			return  44032 + createChoSungCode(cho) + createJungSungCode(jung) + createJongSungCode(jong);
		}

		function createGlyfContours (cho, jung, jong) {
			var result = [];
		
			if (cho && cho.glyf) { 
				result = result.concat(cho.glyf.contours || []);
			}
			if (jung && jung.glyf) {
				result = result.concat(jung.glyf.contours || []);
			}

			if (jong && jong.glyf) {
				result = result.concat(jong.glyf.contours || []);
			} 
			return result;
		}

		function newUnicode(prefix, keys, type, cho, jung, jong) {
			var g_cho = keys[prefix + '-1-' + cho];
			var g_jung = keys[prefix + '-2-' + jung];
			var g_jong = keys[prefix + '-3-' + jong];

			var unicode = createUnicode(cho, jung, jong);

			return {
				unicode : [ unicode ],
				contours : createGlyfContours(g_cho, g_jung, g_jong)
			};

		}

		function makeUnicodeForType(type, keys) {
			// type1,  초성, 중성만 조합 ,  중성중에 단순  모음, 오른쪽에 있는 것만 적용
			var list = [];
			var johap = johap_arr['type' + type];
			
			if (!johap) {
				return list; 
			}

			var param_arr = [];
			if (johap.jong && johap.jong.length)
			{
				johap.cho.forEach(function(cho) {
					johap.jung.forEach(function(jung) {
						johap.jong.forEach(function(jong, i) {

							if (i !== 0)
							{
								param_arr.push([cho, jung, jong]);
							}
							
						});
					});
				});

			} else {
				johap.cho.forEach(function(cho) {
					johap.jung.forEach(function(jung) {
						param_arr.push([cho, jung]);						
					});
				});
			}

			var prefix = GLYFConstant.KOREAN + type;
			for(var i = 0, len = param_arr.length; i < len; i++) {
				list[list.length] = newUnicode(prefix, keys, type, param_arr[i][0], param_arr[i][1], param_arr[i][2]);
			}
			
			return list; 
		}

        return {

			getCheckKeys : function () {
				return ['k1','k2','k3','k4','k5','k6'];
			},

			generate : function () {
				var list = [];

				// 초성 
				list = list.concat(
					createChoSungName(1),
					createChoSungName(2),
					createChoSungName(3),
					createChoSungName(4),
					createChoSungName(5),
					createChoSungName(6),

					createJungSungName(1),
					createJungSungName(2),
					createJungSungName(3),
					createJungSungName(4),
					createJungSungName(5),
					createJungSungName(6),

					createJongSungName(4),
					createJongSungName(5),
					createJongSungName(6)
				);

				return list;
			},
			makeUnicodeGlyf : function (keys) {
				var list = [];

				list = list.concat(
					makeUnicodeForType(1, keys),
					makeUnicodeForType(2, keys),
					makeUnicodeForType(3, keys),
					makeUnicodeForType(4, keys),
					makeUnicodeForType(5, keys),
					makeUnicodeForType(6, keys)
				);

				// 유니코드로 오름차순 정렬 
				list.sort(function(a, b) {
					return a.unicode[0] - b.unicode[0];
				});

				return list; 
			},
			
			/**
			 * 유니코드를 기반으로 다시 초성,중성,종성을 키로 분리해준다. 
			 *
			 *
			 */
			splitJaso : function (unicode) {
				var start = unicode - 0xAC00;
				var jongsung = (start) % 28;

				var second = (start - jongsung)/28;
				var jungsung = (second) % 21;

				var chosung = (second - jungsung)/21;
				var chosung_code = cho_arr[chosung];
				var jungsung_code = jung_arr[jungsung];
				var jongsung_code = jong_arr[jongsung];

				if (jongsung == 0)  { // 1, 2, 3

					if (johap_arr.type1.jung.indexOf(jungsung_code) > -1) {
						return [ 
							GLYFConstant.KOREAN + 1 + '-1-'+chosung_code,
							GLYFConstant.KOREAN + 1 + '-2-'+jungsung_code
						];
					} else if (johap_arr.type2.jung.indexOf(jungsung_code) > -1) {
						return [ 
							GLYFConstant.KOREAN + 2 + '-1-'+chosung_code,
							GLYFConstant.KOREAN + 2 + '-2-'+jungsung_code
						];
					} else if (johap_arr.type3.jung.indexOf(jungsung_code) > -1) {
						return [ 
							GLYFConstant.KOREAN + 3 + '-1-'+chosung_code,
							GLYFConstant.KOREAN + 3 + '-2-'+jungsung_code
						];
					}

				} else {			// 4, 5, 6


					if (johap_arr.type4.jung.indexOf(jungsung_code) > -1) {
						return [ 
							GLYFConstant.KOREAN + 4 + '-1-'+chosung_code,
							GLYFConstant.KOREAN + 4 + '-2-'+jungsung_code,
							GLYFConstant.KOREAN + 4 + '-3-'+jongsung_code
						];
					} else if (johap_arr.type5.jung.indexOf(jungsung_code) > -1) {
						return [ 							
							GLYFConstant.KOREAN + 5 + '-1-'+chosung_code,
							GLYFConstant.KOREAN + 5 + '-2-'+jungsung_code,
							GLYFConstant.KOREAN + 5 + '-3-'+jongsung_code
						];
					} else if (johap_arr.type6.jung.indexOf(jungsung_code) > -1) {
						return [ 
							GLYFConstant.KOREAN + 6 + '-1-'+chosung_code,
							GLYFConstant.KOREAN + 6 + '-2-'+jungsung_code,
							GLYFConstant.KOREAN + 6 + '-3-'+jongsung_code
						];
					}
				}


			},
            getSimilarGlyfName : function (name) {
                var arr = name.split("-");
                var type = arr[0];
                var keys = this.getCheckKeys();
                if (keys.indexOf(type) > -1) {
                    var isCho = arr[1] == '1';
                    var isJung = arr[1] == '2';
                    var isJong = arr[1] == '3';

                    if (isCho) {
                        return keys.map(function(key) {
                            return [key, 1, arr[2]].join('-');
                        });
                    } else if (isJung) {

                        if (jungsung_1_arr.indexOf(arr[2]) > -1) {
                            return [
                                ['k1', '2', arr[2]].join('-'),    
                                ['k4', '2', arr[2]].join('-'),    
                            ];
                        } else if (jungsung_2_arr.indexOf(arr[2]) > -1) {
                            return [
                                ['k2', '2', arr[2]].join('-'),    
                                ['k5', '2', arr[2]].join('-'),    
                            ];

                        } else if (jungsung_3_arr.indexOf(arr[2]) > -1) {
                            return [
                                ['k3', '2', arr[2]].join('-'),    
                                ['k6', '2', arr[2]].join('-'),    
                            ];

                        }

                    } else if (isJong) {
                        keys.shift();
                        keys.shift();
                        keys.shift();
                       
                        return keys.map(function(key) {
                            return [key, 3, arr[2]].join('-');
                        });

                    }
                }
                
                return [];      // 해당사항이 없으면 아무것도 리턴하지 안음 . 
            }
		};
    }
);
