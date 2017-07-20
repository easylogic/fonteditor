/**
 * @file 图像处理模块
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var pixelRatio = require('common/getPixelRatio');

		var renderer = {
			'default' : {
				mousedown : function (context, x, y) {
					if (this.isErase) {
						// NOOP
					} else {
					  context.moveTo(x, y);
					}

				},

				mousemove : function (context, x, y) {
					if (this.isErase)
					{
						context.moveTo(x, y);
						context.arc(x, y, this.lineWidth/2, 0, Math.PI * 2, false);
						context.fill();
					} else {
						context.lineTo(x, y);
						context.stroke();
					}

				}
			},
			'shadow' : {
				mousedown : function (context, x, y) {
					context.shadowBlur = 10;
					context.shadowColor = 'rgb(0, 0, 0)';
					context.moveTo(x, y);
				},
				mousemove : function (context, x, y) {
					context.lineTo(x, y);
					context.stroke();
				}
			},
			'radial-gradient' : {
				mousedown : function (context, x, y) {
					context.moveTo(x, y);
				},
				mousemove : function (context, x, y) {
					var g = context.createRadialGradient(x,y,10,x,y,20);
    
					g.addColorStop(0, '#000');
					g.addColorStop(0.5, 'rgba(0,0,0,0.5)');
					g.addColorStop(1, 'rgba(0,0,0,0)');
					context.fillStyle = g;
				
					context.fillRect(x-20, y-20, 40, 40);
				}
			}
		};

        /**
         * 灰度图像处理子程序，处理灰度图像和二值图像
         *
         * @param {Object} imageData 图像数据
         */
        function DrawProcessor(canvas) {
            this.canvas = canvas;
			
			this.isErase = false; 
			this.setRenderType('default');
			this.setStrokeStyle('#000000');
			this.setLineWidth(20); 
			this.setLineJoin('round');
			this.setLineCap('round');
        }

		DrawProcessor.prototype.drawGlyf = function (glyf) {

			if (glyf.unicode)
			{
				console.log(glyf.fontSize);
				var font = [glyf.fontSize + 'px', glyf.fontFamily].join(" ");
				this.canvas.ctx.font = font ;
				this.canvas.ctx.fillStyle = glyf.color;
				this.canvas.textAlign = "left";
				this.canvas.textBaseline = "middle";
				this.canvas.ctx.fillText(String.fromCharCode(glyf.unicode), 0, 230);
			}

		}

		DrawProcessor.prototype.setErase = function (isErase) {
			this.isErase =  isErase; 
		}

		DrawProcessor.prototype.toggleErase = function () {
			this.isErase = !this.isErase;
		}

		DrawProcessor.prototype.setEraseStyle = function (eraseStyle) {
			this.strokeStyle = eraseStyle || 'rgba(255, 255, 255, 1)';
		}

		DrawProcessor.prototype.setStrokeStyle = function (strokeStyle) {
			this.strokeStyle = strokeStyle || '#000000';
		}

		DrawProcessor.prototype.setRenderType = function (renderType) {
			this.renderType = renderType || 'default';
		}

		DrawProcessor.prototype.setLineWidth = function (lineWidth) {
			this.lineWidth = lineWidth || 10; 
		}

		DrawProcessor.prototype.setLineJoin = function (lineJoin) {
			this.lineJoin = lineJoin || 'round'; 
		}

		DrawProcessor.prototype.setLineCap = function (lineCap) {
			this.lineCap = lineCap || 'round'; 
		}

		DrawProcessor.prototype.mousedown = function (e, pos) {
			this.canvas.ctx.beginPath();

			if (this.isErase)
			{
				this.canvas.ctx.globalCompositeOperation="destination-out";
			} else {
				this.canvas.ctx.globalCompositeOperation="source-over";
			}

			var x = e.clientX - pos.left;
			var y = e.clientY - pos.top;

			if (pixelRatio !== 1)
			{
				x = x / pixelRatio;
				y = y / pixelRatio;
			}

			renderer[this.renderType].mousedown.call(this, this.canvas.ctx, x, y);
		}
		DrawProcessor.prototype.mousemove = function (e, pos) {

			var x = e.clientX - pos.left;
			var y = e.clientY - pos.top;

			if (pixelRatio !== 1)
			{
				x = x / pixelRatio;
				y = y / pixelRatio;
			}

			renderer[this.renderType].mousemove.call(this, this.canvas.ctx, x, y);
		}

		DrawProcessor.prototype.initEvent = function () {
			
			// canvas  사이즈는 어떻게 고정할까요? 
			// canvas drawing  메커니즘을 적용한다. 
			var canvasOrigin = this.canvas; 
			var isDrawing = false; 
			var pos = { };
			var self = this; 
			canvasOrigin.onmousedown = function(e) {
				isDrawing = true;
				pos = $('.preview-panel').offset();
				canvasOrigin.ctx.strokeStyle = self.strokeStyle;
				canvasOrigin.ctx.lineWidth = self.lineWidth;
				canvasOrigin.ctx.lineJoin = self.lineJoin;
				canvasOrigin.ctx.lineCap = self.lineCap;
				self.mousedown(e, pos);
			};
			canvasOrigin.onmousemove = function(e) {
			  if (isDrawing) {
				self.mousemove(e, pos);
			  }
			};
			canvasOrigin.onmouseup = function() {
			  isDrawing = false;
			};

			this.onpaste = (function (self) { 
				return function (e) {
					self.pasteImage(e);
				}
			})(this);

			document.addEventListener('paste', this.onpaste);
		};

		DrawProcessor.prototype.pasteImage = function (e) {
			if (e.clipboardData) {
				var items = e.clipboardData.items;
				if (!items) return;
				
				//access data directly
				for (var i = 0; i < items.length; i++) {
					if (items[i].type.indexOf("image") !== -1) {
						//image
						var blob = items[i].getAsFile();
						var URLObj = window.URL || window.webkitURL;
						var source = URLObj.createObjectURL(blob);
						this.pasteCreateImage(source);
					}
				}
				e.preventDefault();
			}
		};

		DrawProcessor.prototype.pasteCreateImage = function (source) {
			var context = this.canvas.ctx;
			var image = new Image();
			image.onload = function () {
				context.drawImage(image, 0, 0);
			};

			image.src = source ;
		};

		DrawProcessor.prototype.dispose = function () {
			this.canvas.onmousedown = null;
			this.canvas.onmousemove = null;
			this.canvas.onmouseup = null;
			this.canvas = null;

			document.removeEventListener('paste', this.onpaste);
		}

        return DrawProcessor;
    }
);
