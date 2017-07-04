
define(
    function (require) {

        var OTFReader = require('ttf/otfreader');

        describe('读otf数据', function () {

            var fontObject = new OTFReader().read(require('data/BalladeContour.otf'));

            it('test read otf', function () {
                expect(fontObject.version).toBe('OTTO');
                expect(fontObject.numTables).toBe(9);
                expect(fontObject.rengeShift).toBe(16);
                expect(fontObject.searchRenge).toBe(128);
            });

            it('test read otf head', function () {
                expect(fontObject.head.magickNumber).toBe(1594834165);
                expect(fontObject.head.unitsPerEm).toBe(1000);
                expect(fontObject.head.checkSumAdjustment).toBe(2157456233);
            });

            it('test read otf name', function () {
                expect(fontObject.name.fontFamily).toBe('Ballade Contour');
                expect(fontObject.name.fontSubFamily).toBe('Regular');
                expect(fontObject.name.fullName).toBe('BalladeContour');
            });


            it('test read otf post', function () {
                expect(fontObject.post.format).toBe(3);
                expect(fontObject.post.underlinePosition).toBe(-75);
                expect(fontObject.post.underlineThickness).toBe(50);
            });

            it('test read otf hhea', function () {
                expect(fontObject.hhea.advanceWidthMax).toBe(1081);
                expect(fontObject.hhea.ascent).toBe(758);
                expect(fontObject.hhea.descent).toBe(-146);
            });

            it('test read otf maxp', function () {
                expect(fontObject.maxp.version).toBe(0.3125);
                expect(fontObject.maxp.numGlyphs).toBe(47);
            });

            it('test read otf glyf', function () {
                expect(fontObject.glyf[0].advanceWidth).toBe(500);
                expect(fontObject.glyf[3].contours[0].length).toBe(96);
            });

            it('test read otf CFF', function () {
                expect(!!fontObject.CFF).toBe(true);
                expect(fontObject.CFF.defaultWidthX).toBe(500);
                expect(fontObject.CFF.nominalWidthX).toBe(708);
                expect(fontObject.CFF.topDict.uniqueId).toBe(308228);
                expect(fontObject.CFF.topDict.familyName).toBe('Ballade Contour');
                expect(fontObject.CFF.topDict.weight).toBe('Normal');
                expect(fontObject.CFF.topDict.underlineThickness).toBe(50);
                expect(fontObject.CFF.topDict.underlinePosition).toBe(-100);
            });

			

            it('test read otf subset', function () {
                var fontObject = new OTFReader({
                    subset: [0x31, 0x32, 0xe001]
                }).read(require('data/BalladeContour.otf'));
                expect(fontObject.glyf.length).toBe(3);
                expect(fontObject.glyf[0].name).toBe('.notdef');
                expect(fontObject.glyf[1].unicode[0]).toBe(0x31);
                expect(fontObject.glyf[2].unicode[0]).toBe(0x32);
                expect(fontObject.subsetMap[0]).toBe(true);
                expect(fontObject.subsetMap[1]).toBe(true);
                expect(fontObject.subsetMap[2]).toBe(true);
            });

        });

		describe('otf CID keyed font', function () {

            var fontObject = new OTFReader().read(require('data/FDArrayTest257.otf'));
			it('can load a CID-keyed font', function() {
				expect(fontObject.name.fontFamily).toBe('FDArray Test 257');

				expect(fontObject.CFF.topDict.ros).toEqual(['Adobe', 'Identity', 0]);
				expect(fontObject.CFF.topDict._fdArray.length).toBe(256);
				expect(fontObject.CFF.topDict._fdSelect[0]).toBe(0);
				expect(fontObject.CFF.topDict._fdSelect[42]).toBe(0);
				expect(fontObject.CFF.topDict._fdSelect[256]).toBe(0);
				expect(fontObject.head.unitsPerEm).toBe(1000);
				expect(fontObject.glyf.length, 257);
				var aGlyph = fontObject.glyf[2];
				expect(aGlyph.name).toBe('exclam');
				expect(aGlyph.unicode[0]).toBe(1);
				//expect(aGlyph.path.commands.length, 24);
			});

        });


        describe('读错误otf数据', function () {

            it('test read version error', function () {
                expect(function () {
                    new OTFReader().read(new Uint8Array([0, 1, 0, 0, 25, 4, 11]).buffer);
                }).toThrow();
            });

            it('test read range error', function () {
                expect(function () {
                    new OTFReader().read(new Uint8Array([0, 1, 0, 0, 0, 10, 11, 45, 8]).buffer);
                }).toThrow();
            });
        });
    }
);
