/**
 * @file 图像处理模块
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var pixelRatio = require('common/getPixelRatio');

		var renderer = {
			'default' : {
				mousedown : function (context, pos) {
					if (this.isErase) {
						// NOOP
					} else {
					  context.moveTo(pos.x, pos.y);
					}

				},

				mousemove : function (context, pos) {
					if (this.isErase)
					{
						context.moveTo(pos.x, pos.y);
						context.arc(pos.x, pos.y, this.lineWidth/2, 0, Math.PI * 2, false);
						context.fill();
					} else {
						context.lineTo(pos.x, pos.y);
						context.stroke();
					}

				}
			},
			'shadow' : {
				mousedown : function (context, pos) {
					context.shadowBlur = this.lineWidth/2;
					context.shadowColor = 'rgb(0, 0, 0)';
					context.moveTo(pos.x, pos.y);
				},
				mousemove : function (context, pos) {
					context.lineTo(pos.x, pos.y);
					context.stroke();
				}
			},
			'radial-gradient' : {
				mousedown : function (context, pos) {
					context.moveTo(pos.x, pos.y);
				},
				mousemove : function (context, pos) {
					var g = context.createRadialGradient(pos.x, pos.y,this.lineWidth/2,pos.x, pos.y,this.lineWidth);
    
					g.addColorStop(0, '#000');
					g.addColorStop(0.5, 'rgba(0,0,0,0.5)');
					g.addColorStop(1, 'rgba(0,0,0,0)');
					context.fillStyle = g;
				
					context.fillRect(pos.x - this.lineWidth, pos.y - this.lineWidth,  this.lineWidth * 2, this.lineWidth * 2);
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

			var $el = $(this.canvas);
	
			$el.css('cursor', 'pointer');
			
			this.isErase = false; 
			this.setRenderType('shadow');
			this.setStrokeStyle('#000000');
			this.setLineWidth(10); 
			this.setLineJoin('round');
			this.setLineCap('round');

			this.makeTracker();
		}
		
		DrawProcessor.prototype.makeTracker = function () {

			this.$tracker = $("<div />").css({
				position: "absolute",
				borderRadius: '50%',
				border: "1px solid rgba(255, 255, 255, 0.3)",
				backgroundColor: 'transparent',
				'pointer-events' : 'none'
			});

			this.hideTracker();

			this.$tracker.insertAfter(this.canvas);			
		}

		DrawProcessor.prototype.drawGlyf = function (glyf) {

			if (glyf.unicode)
			{
				var fontSize = glyf.fontSize / pixelRatio;
				var font = [fontSize + 'px', glyf.fontFamily].join(" ");
				var text = String.fromCharCode(glyf.unicode);
				this.canvas.ctx.font = font ;
				this.canvas.ctx.fillStyle = this.strokeStyle;
				this.canvas.ctx.textAlign = "left";
				this.canvas.ctx.textBaseline = "top";
				this.canvas.ctx.fillText(text, 0, 0 );
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

		DrawProcessor.prototype.getXY = function (e, pos, touchIndex) {

			var x = (e.laryerX || e.clientX) - pos.left;
			var y = (e.laryerY || e.clientY) - pos.top;

			if (e.originalEvent.changedTouches) {
				x = e.originalEvent.changedTouches[touchIndex || 0].pageX - pos.left;
				y = e.originalEvent.changedTouches[touchIndex || 0].pageY - pos.top;
			} else {
				x += $("html,body").scrollLeft()
				y += $("html,body").scrollTop()
			}

			if (pixelRatio !== 1)
			{
				x = x / pixelRatio;
				y = y / pixelRatio;
			}

			return { x : x , y : y };
		}

		DrawProcessor.prototype.setTrackerPosition = function (xy, isShow) {
			if (isShow) {
				this.$tracker.show();
			}

			this.$tracker.css({
				left: (xy.x * pixelRatio + this.offset.left) - (this.lineWidth * pixelRatio)/2,
				top : (xy.y + 20 - this.lineWidth/2) * pixelRatio
			})
		
			console.log(xy.y, pixelRatio, this.$tracker.css('top'), this.lineWidth);
		}

		DrawProcessor.prototype.hideTracker = function () {
			//this.$tracker.hide();
		}

		DrawProcessor.prototype.mousedown = function (e, pos) {
			this.canvas.ctx.beginPath();

			if (this.isErase)
			{
				this.canvas.ctx.globalCompositeOperation = "destination-out";
			} else {
				this.canvas.ctx.globalCompositeOperation = "source-over";
			}

			var xy = this.getXY(e, pos);

			this.setTrackerPosition(xy, true);

			renderer[this.renderType].mousedown.call(this, this.canvas.ctx, xy);
		}
		DrawProcessor.prototype.mousemove = function (e, pos) {

			var xy = this.getXY(e, pos);
			
			this.setTrackerPosition(xy);

			renderer[this.renderType].mousemove.call(this, this.canvas.ctx, xy);
		}

		DrawProcessor.prototype.drawstart = function (e) {
			
			this.canvas.ctx.strokeStyle = this.strokeStyle;
			this.canvas.ctx.lineWidth = this.lineWidth;
			this.canvas.ctx.lineJoin = this.lineJoin;
			this.canvas.ctx.lineCap = this.lineCap;

			this.$tracker.css({
				width: this.lineWidth * pixelRatio,
				height: this.lineWidth * pixelRatio,
			})

			var $previewPanel = $('.preview-panel');
			pos = $previewPanel.offset();		

			this.mousedown(e, pos);

			return pos; 
		}

		DrawProcessor.prototype.initEvent = function (offset) {
			
			// canvas  사이즈는 어떻게 고정할까요? 
			// canvas drawing  메커니즘을 적용한다. 
			var $canvasOrigin = $(this.canvas); 
			var isDrawing = false; 
			var pos = { };
			var self = this; 
			self.offset = offset; 


			$canvasOrigin.on('mousedown', function(e) {
				isDrawing = true;
				pos = self.drawstart(e);
			});

			$canvasOrigin.on('mousemove', function(e) {
			  if (isDrawing) {
				self.mousemove(e, pos);
			  }
			});
			$canvasOrigin.on('mouseup', function() {
			  isDrawing = false;
			  self.hideTracker(); 
			});

			this.onpaste = (function (self) { 
				return function (e) {
					self.pasteImage(e);
				}
			})(this);

			document.addEventListener('paste', this.onpaste);

			this.initTouchEvent();
		};

		DrawProcessor.prototype.initTouchEvent = function () {
			
			// canvas  사이즈는 어떻게 고정할까요? 
			// canvas drawing  메커니즘을 적용한다. 
			var $canvasOrigin = $(this.canvas); 
			var isDrawing = false; 
			var pos = { };
			var self = this; 

			$canvasOrigin.on('touchstart', function(e) {
				isDrawing = true;
				e.preventDefault();
				pos = self.drawstart(e);
			});
			$canvasOrigin.on('touchmove', function(e) {
			  if (isDrawing) {
				e.preventDefault();				  
				self.mousemove(e, pos);
			  }
			});
			$canvasOrigin.on('touchend', function() {
			  isDrawing = false;
			  self.hideTracker(); 
			});
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
			$(this.canvas).off('mousedown mousemove mouseup touchstart touchmove touchend');
			this.canvas = null;
			this.offset = null;

			document.removeEventListener('paste', this.onpaste);
		}

        return DrawProcessor;
    }
);
