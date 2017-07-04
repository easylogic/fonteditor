/**
 * @file 形状相关命令
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var pathsUtil = require('graphics/pathsUtil');


        return {

			addpoint : function () {
				if (this.mode.command) this.mode.command(this, { command : 'add' });

			},
			removepoint : function () { 
				if (this.mode.command) this.mode.command(this, { command : 'remove' });
			},
			onCurve : function () { 
				if (this.mode.command)  this.mode.command(this, { command : 'onCurve' });
			},
			offCurve : function () { 
				if (this.mode.command) this.mode.command(this, { command : 'offCurve' });
			},
			asStart : function () { 
				if (this.mode.command) this.mode.command(this, { command : 'asStart' });
			}
        };
    }
);
