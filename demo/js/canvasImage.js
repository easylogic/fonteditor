/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var image2Values = require('graphics/image/image2Values');
        var findContours = require('graphics/image/findContours');

        var ctx = null;
        var canvas = null;
        var curImage = null;
        var thresholdGray = null;
        var thresholdAlpha = null;



        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {

                var image = curImage = new Image();
                image.onload = function () {
                    getContours(image, +thresholdGray.value, +thresholdAlpha.value);
                };

                image.src = e.target.result;
            }

            reader.onerror = function(e) {
                console.error(e);
            };

            reader.readAsDataURL(file);
        }

        function getContours(image, gray, alpha) {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            var width = image.width;
            var height = image.height;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, width, height);
            var imgData = ctx.getImageData(0, 0, width, height);
            var result = image2Values(imgData, gray, alpha);
            var contours = findContours(result);
            var putData = new Uint8ClampedArray(imgData.data.buffer);
            for (var y = 0; y < height; y ++) {
                var line = height * y;
                for (var x = 0; x < width; x++) {
                    var offset = line + x;
                    if (result.data[offset]) {
                        putData[offset * 4] = 240;
                        putData[offset * 4 + 1] = 248;
                        putData[offset * 4 + 2] = 255;
                        putData[offset * 4 + 3] = 255;
                    }
                }
            }
            contours.forEach(function (contour) {
                contour.forEach(function (p) {
                    var offset = p.y * width + p.x;
                    putData[offset * 4] = 255;
                    putData[offset * 4 + 1] = 0;
                    putData[offset * 4 + 2] = 0;
                    putData[offset * 4 + 3] = 255;
                });
            });
            ctx.putImageData(imgData, 0, 0);
        }




        var entry = {

            /**
             * 初始化
             */
            init: function () {

                document.getElementById('upload-file').addEventListener('change', onUpFileChange);
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");
                thresholdGray = document.getElementById('threshold-gray');
                thresholdAlpha = document.getElementById('threshold-alpha');

                thresholdGray.onchange = thresholdAlpha.onchange = function () {
                    curImage && getContours(curImage, +thresholdGray.value, +thresholdAlpha.value);
                }
            }
        };

        entry.init();

        return entry;
    }
);
