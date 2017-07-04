/**
 * @file 刻度指示
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * 刻度指示
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 选项参数
         */
        function GraduationMarker(main, options) {
            options = options || {};
            var xAxis = document.createElement('div');
            xAxis.className = 'marker-x';
            var yAxis = document.createElement('div');
            yAxis.className = 'marker-y';

            if (options.thickness) {
                xAxis.style.width = options.thickness + 'px';
                yAxis.style.height = options.thickness + 'px';
            }

			// TODO: 마커를 표시할 때 다시 주석을 풀어주세요. 할일이 없을 듯도 하고 . 
			this.xAxis = xAxis
			this.yAxis = yAxis

            //main.appendChild(this.xAxis);
            //main.appendChild(this.yAxis);
        }

        /**
         * 显示坐标
         *
         * @param {number} x x坐标
         * @param {number} y y坐标
         */
        GraduationMarker.prototype.moveTo = function (x, y) {
            //this.xAxis.style.top = y + 'px';
            //this.yAxis.style.left = x + 'px';
        };

        /**
         * 注销
         */
        GraduationMarker.prototype.dispose = function () {
            //this.xAxis.parentNode.removeChild(this.xAxis);
            //this.yAxis.parentNode.removeChild(this.yAxis);
            //this.xAxis = this.yAxis = null;
        };

        return GraduationMarker;
    }
);
