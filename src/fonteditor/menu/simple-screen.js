define(
    function (require) {
        var ei18n = require('editor/i18n/i18n');

        return [
            {
                name: 'showgrid',
                ico: 'grid',
                title: ei18n.lang.showgrid
            },
            {
                name: 'showoutline',
				ico: 'outline',
                title: ei18n.lang.showoutline
            },
            {
                name: 'showaxis',
				ico: 'axis',
                title: ei18n.lang.showaxis
            },
            {
                name: 'showreference',
                ico: 'reference',
                title: ei18n.lang.showreference
            },
            {
                type: 'split'
            },            
            /*{
				type : 'input',
                name: 'scaleinput',
                title: 'Scale'
            },*/
            {
				direction : 'right',
                name: 'move-up',
				ico: 'arrow-up',
                title: "&uarr;"
            },
            {
				direction : 'right',
                name: 'move-down',
				ico: 'arrow-down',
                title: "&darr;"
            },
            {
				direction : 'right',
                name: 'move-right',
				ico: 'arrow-right',
                title: "&rarr;"
            },
            {
				direction : 'right',
                name: 'move-left',
				ico: 'arrow-left',
                title: "&larr;"
            },
			{	
				direction : 'right',
                name: 'rescale',
				ico: 'rescale',
                title: ei18n.lang.rescale,
            },
            {
				direction : 'right',
                name: 'narrowview',
				ico: 'zoomout',
                title: ei18n.lang.zoomout
            },
            {
				direction : 'right',
				name: 'enlargeview',
				ico: 'zoomin',
                title: ei18n.lang.zoomin
            } 
        ];
    }
);
