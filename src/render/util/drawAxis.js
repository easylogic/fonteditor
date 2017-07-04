/**
 * @file 绘制辅助线
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var dashedLineTo = require('./dashedLineTo');

        /**
         * 绘制辅助线
         *
         * @param {CanvasRenderingContext2D} ctx context对象
         * @param {Object} config 配置信息
         */
        function drawAxis(ctx, config) {
            var gap = Math.round(config.graduation.gap * config.scale);
            var xMax = Math.round(ctx.canvas.width + gap);
            var yMax = Math.round(ctx.canvas.height + gap);
            var x = Math.round(config.x);
            var y = Math.round(config.y);
            var i;

            // 디스플레이 격자 선
            if (false !== config.showGrid) {
                ctx.beginPath();
                ctx.strokeStyle = config.gapColor || '#A6A6FF';

                // 가로선
                for (i = y; i < yMax; i += gap) {
                    ctx.moveTo(0, i);
                    ctx.lineTo(xMax, i);
                }

                for (i = y; i > 0; i -= gap) {
                    ctx.moveTo(0, i);
                    ctx.lineTo(xMax, i);
                }


                // 세로선
                for (i = x; i < xMax; i += gap) {
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, yMax);
                }

                for (i = x; i > 0; i -= gap) {
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, yMax);
                }

                ctx.stroke();
            }

            // metrics
			
			ctx.beginPath();
			ctx.strokeStyle = config.metricsColor || '#FF6E67';
			// 보조 라인을 그리기
			var metrics = config.metrics;
			var thickness = config.graduation.thickness || 22;
			var metricsLines = Object.keys(metrics);

			metricsLines.forEach(function (line) {
				/*
				if (line == 'descent' )
				{

				} 
				else if (line == 'ascent')
				{

				} else { */

					var lineY = y - Math.round(metrics[line]);
					dashedLineTo(ctx, 0, lineY, xMax, lineY, 4);
				/* } */
			});
			ctx.stroke();

            // axis , draw base line 
	        ctx.beginPath();
            ctx.strokeStyle = config.axisColor || 'red';
            ctx.moveTo(0, y);
            ctx.lineTo(xMax, y);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, yMax);
            ctx.stroke(); 

            // text
            ctx.save();
            ctx.scale(0.8, 0.8);

			if (!config.hideMetrics)
			{
				ctx.strokeStyle = config.metricsTextColor || 'red';
				metricsLines.forEach(function (line) {
					var first = line[0].toUpperCase();
					ctx.fillText(first, thickness * 1.25 + 4, (y - metrics[line]) * 1.25 - 6);
				});

			}
			// baseline 
            ctx.fillText('B', thickness * 1.25 + 2, y * 1.25 - 4);
            ctx.restore();
        }

        return drawAxis;
    }
);
