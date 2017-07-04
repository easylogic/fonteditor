/**
 * @file 获得缩放变换的矩阵
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		var OriginCenterFunction = {
			left : function (matrix, bound, camera) {	// 왼쪽으로 커질때 
				var tx = bound.x - camera.x;
				matrix[0] = bound.x + bound.width;
				matrix[2] = -(camera.x - matrix[0] - tx) / bound.width;
				matrix[4] = bound.x + bound.width + tx;
			},
			right : function (matrix, bound, camera) {	// 오른쪽으로 커질때 
				var tx = camera.x - bound.width - bound.x;
				matrix[0] = bound.x;
				matrix[2] = (camera.x - matrix[0] + tx) / (bound.width);
				matrix[4] = bound.x - tx;
			},
			top : function (matrix, bound, camera) {	// 위쪽으로 커질때
				var ty = bound.y - camera.y;
				matrix[1] = bound.y + bound.height;
				matrix[3] = -(camera.y - matrix[1] - ty) / bound.height;
				matrix[5] = bound.y + bound.height + ty;
			},
			bottom : function (matrix, bound, camera) {	// 아래쪽으로 커질때
				var ty = camera.y - bound.height - bound.y;
				matrix[1] = bound.y;
				matrix[3] = (camera.y - matrix[1] + ty) / (bound.height);
				matrix[5] = bound.y - ty;
			},
			centerX : function (matrix, bound, camera) { // x축 고정 
				matrix[0] = 0;
				matrix[2] = 1;
				matrix[4] = 0;
			},
			centerY : function (matrix, bound, camera) { // y축 고정
				matrix[1] = 0;
				matrix[3] = 1;
				matrix[5] = 0;
			}
		};

		var TransformFunction = {
			left : function (matrix, bound, camera) {
				matrix[0] = bound.x + bound.width;
				matrix[2] = -(camera.x - matrix[0]) / bound.width;
			},
			top : function (matrix, bound, camera) {
				matrix[1] = bound.y + bound.height;
				matrix[3] = -(camera.y - matrix[1]) / bound.height;
			},
			right : function (matrix, bound, camera) {
				matrix[0] = bound.x;
				matrix[2] = (camera.x - matrix[0]) / bound.width;
			},
			bottom : function (matrix, bound, camera) {
				matrix[1] = bound.y;
				matrix[3] = (camera.y - matrix[1]) / bound.height;
			},
			centerX : function (matrix, bound, camera) {
				matrix[0] = 0;
				matrix[2] = 1;
			},
			centerY : function (matrix, bound, camera) {
				matrix[1] = 0;
				matrix[3] = 1;
			}
		};


        /**
         * 获得变换矩阵
         *
         * @param {number} pos 变换位置
         * @param {Object} bound 边界
         * @param {Camera} camera 镜头对象
		 * @param {Boolean} isOriginCenter
         * @return {Array} 변환 행렬，x, y, xScale, yScale
         */
        function getScaleMatrix(pos, bound, camera, isOriginCenter) {
            // x, y, xscale 상대값, yscale 상대값
            var matrix = [
                0,
                0,
                1,
                1
            ];

            switch (pos) {
                case 1:   // left, top 

					if (isOriginCenter)
					{
						OriginCenterFunction.left(matrix, bound, camera);
						OriginCenterFunction.top(matrix, bound, camera);
					} else {
						TransformFunction.left(matrix, bound, camera);
						TransformFunction.top(matrix, bound, camera);
					}


                    break;
                case 2:		// right, top
					if (isOriginCenter)
					{
						OriginCenterFunction.right(matrix, bound, camera);
						OriginCenterFunction.top(matrix, bound, camera);
					} else {
						TransformFunction.right(matrix, bound, camera);
						TransformFunction.top(matrix, bound, camera);
					}

                    break;
                case 3:		// right, bottom 
					if (isOriginCenter) {
						OriginCenterFunction.right(matrix, bound, camera);
						OriginCenterFunction.bottom(matrix, bound, camera);

					} else {
						TransformFunction.right(matrix, bound, camera);
						TransformFunction.bottom(matrix, bound, camera);
					}

                    break;
                case 4:		// left, bottom 
					if (isOriginCenter)
					{
						OriginCenterFunction.left(matrix, bound, camera);
						OriginCenterFunction.bottom(matrix, bound, camera);

					} else {
						TransformFunction.left(matrix, bound, camera);
						TransformFunction.bottom(matrix, bound, camera);
					}


                    break;
                case 5:     // center, top
					if (isOriginCenter)
					{
						OriginCenterFunction.centerX(matrix, bound, camera);
						OriginCenterFunction.top(matrix, bound, camera);
					} else {
						TransformFunction.centerX(matrix, bound, camera);
						TransformFunction.top(matrix, bound, camera);
					}
                    break;
                case 7:     // center, bottom
					if (isOriginCenter)
					{
						OriginCenterFunction.centerX(matrix, bound, camera);
						OriginCenterFunction.bottom(matrix, bound, camera);
					} else {
						TransformFunction.centerX(matrix, bound, camera);
						TransformFunction.bottom(matrix, bound, camera);
					}
                    break;
                case 6:     // right, center 
					if (isOriginCenter)
					{
						OriginCenterFunction.centerY(matrix, bound, camera);
						OriginCenterFunction.right(matrix, bound, camera);
					} else {
						TransformFunction.centerY(matrix, bound, camera);
						TransformFunction.right(matrix, bound, camera);
					}
                    break;
                case 8:     // left, center 
					if (isOriginCenter)
					{
						OriginCenterFunction.centerY(matrix, bound, camera);
						OriginCenterFunction.left(matrix, bound, camera);
					} else {
						TransformFunction.centerY(matrix, bound, camera);
						TransformFunction.left(matrix, bound, camera);
					}
					break; 
            }

            return matrix;
        }


        return getScaleMatrix;
    }
);
