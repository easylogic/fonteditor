/**
 * @file 导出器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var font = require('fonteditor-core/ttf/font');
        var resolvettf = require('./util/resolvettf');
        var ttf2icon = require('fonteditor-core/ttf/ttf2icon');
        var config = require('fonteditor-core/ttf/data/default');
        var exportRender = require('../template/export-render');
        var download = require('./util/download');
        var JSZip = require('JSZip');

        /**
         * 导出SFNT结构字体 base64
         *
         * @inner
         *
         * @param {Object} ttf ttf字体结构
         * @param {Object} options 参数
         * @param {Object} options.type 文件类型
         *
         * @return {Binary} base64 font file
         */
        function writefont(ttf, options) {
            options.type = options.type || 'ttf';
            ttf = resolvettf(ttf, options);
            return font.create(ttf).write(options);
        }

        /**
         * 导出SFNT结构字体
		 * 
		 * SFNT 폰트 형식  내보내기  
         *
         * @param {Object} ttf ttf字体结构
         * @param {Object} options 参数
         * @param {Object} options.type 文件类型
         * @param {Object} options.fileName 文件名
         * @param {Function} options.success 成功回调
         * @param {Function} options.error 失败回调
         *
         * @return {HTMLElement} 导出按钮
         */
        function exportFile(ttf, options) {

            if (ttf) {

                try {
                    var base64Str = '';
                    var fileName = (options.fileName || ttf.name.fontFamily || 'export');

                    if (options.isReduceGlyf) {
                        fileName += "-small";
                    }

                    // 导出, zip 파일 만들기 
                    if (options.type === 'zip') {

                        // zip
                        var zip = new JSZip();
                        var fontzip = zip.folder(config.fontId);
                        var symbolText;
                        // ttf
                        ['woff', 'eot', 'svg', 'ttf', 'symbol'].forEach(function (fileType) {
                            var name = fileName + '.' + fileType;
                            var content = writefont(ttf, {
                                type: fileType
                            });
                            if (fileType === 'symbol') {
                                name = fileName + '-symbol.svg';
                                symbolText = content;
                            }

                            fontzip.file(name, content);
                        });

                        // icon
                        var iconData = ttf2icon(ttf);

                        // css
                        fontzip.file(
                            'icon.css',
                            exportRender.renderFontCss(iconData)
                        );

                        // page
                        fontzip.file(
                            'page.css',
                            exportRender.renderPreviewCss()
                        );

                        // html
                        fontzip.file(
                            'example.html',
                            exportRender.renderFontExample(iconData)
                        );

                        // symbol example
                        iconData.symbolText = symbolText;
                        fontzip.file(
                            'example-symbol.html',
                            exportRender.renderSymbolExample(iconData)
                        );

                        // zip
                        base64Str = 'data:application/zip;base64,' + zip.generate({
                            type: 'base64'
                        });

                    }
                    else {
                        var buffer = writefont(ttf, options);
                        base64Str = font.toBase64(buffer);

                        base64Str = 'data:font/'
                            + options.type
                            + ';charset=utf-8;base64,'
                            + base64Str;
                    }

                    download(fileName + '.' + options.type, base64Str);

					// TODO: 다운로드 여부 체크해서  바로 서버로 배포해도 될 듯 하다.  
					// TODO: 배포 시스템은 여기 기준으로 만드는 것으로 하자. 

                    if (options.success) {
                        options.success(base64Str);
                    }
                }
                catch (e) {
                    if (options.error) {
                        options.error(e);
                    }
                    alert(e.message);
                    throw e;
                }
            }
        }


        var exporter = {
            'export': exportFile
        };

        return exporter;
    }
);
