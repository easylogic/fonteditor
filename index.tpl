<!DOCTYPE html>
<html lang="${lang.lang}">
<head>
    <meta charset="UTF-8">
    <title>FontMoa - FontEditor</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="./dep/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="./css/main.css">
</head>
<body class='view-mode only-editor show-sidebar show-main show-editor'>

    <section class="navbar" role="navigation">
        <div class="logo">
			<a href="/" title="Welcome to Fontmoa!!">Fontmoa</a> 
			<span class='language'>
				<a href="simple.html" title="${lang.korean}">${lang.korean}</a>
				<a href="simple-en.html" title="${lang.english}">${lang.english}</a>
				<a href="simple-cn.html" title="${lang.chinese}">${lang.chinese}</a>
			</span>
		</div> 

        <div class="action-groups btn-groups">
            <button data-action="add-new" type="button" class="btn btn-flat btn-new glyf-add-button" title="${lang.newglyph}"><i class="ico ico-left i-add"></i> ${lang.newglyph}</button>
			
			<div style="float:right; margin-right:10px;">


				<span >

					<span>${lang.download}</span>	

					<a class='btn btn-flat' data-disabled="1" data-action="download-glyf" title="${lang.export_image}"><i class='ico i-file-image'></i></a>
					<a class='btn btn-flat' data-disabled="1" data-action="export" data-type="ttf" title="${lang.export_ttf}"><i class="ico i-ttf"></i></a>
					<a class='btn btn-flat' data-disabled="1" data-action="export" data-type="woff" title="${lang.export_woff}"><i class="ico i-woff"></i></a>
					<a class='btn btn-flat' data-disabled="1" data-action="export" data-type="zip" title="${lang.export_zip}"><i class="ico i-zip"></i></a>
				</span>

				<i class="split"></i>			

				<span >

					<span>${lang.preview}</span>
	
					<a class='btn btn-flat' data-disabled="1" data-format="ttf" data-action="preview" title="${lang.preview_ttf}(F3)">${lang.preview_ttf}</a>
					<a class='btn btn-flat' data-disabled="1" data-format="woff" data-action="preview" title="${lang.preview_woff}(F4)">${lang.preview_woff}</a>
				</span>

				<a class='change-editor' href='${lang.simple_mode_link}'> &gt; simple mode</a>
			</div>	
        </div>

        <div class="switch-lang">

        </div>
    </section>
    <section class="toolbar" role="tools">
        <div class="action-groups btn-groups">
			
			<div style="float:left;">
                <span>
                    <span>Layout</span>

                    <a class='btn btn-flat' data-action="layout-editor-only" title="fullscreen editor">Editor</a>
                    <a class='btn btn-flat' data-action="layout-glyf-only" title="fullscreen editor">Info</a>
                    <a class='btn btn-flat' data-action="layout-glyf-viewer" title="fullscreen editor">Glyf</a>
                    <a class='btn btn-flat' data-action="layout-project-only" title="fullscreen editor">Project</a>
                    <a class='btn btn-flat' data-action="layout-all" title="fullscreen editor">All</a>
                </span>
			</div>	
        </div>

        <div class="switch-lang">

        </div>
    </section>

    <section class="sidebar">
        <div class="project">
            <div class="project-title">${lang.project_list}
				<div class="project-btns action-groups">
					<button data-action="new" type="button" class="btn btn-flat" title="${lang.new_font_title}"><i class="ico ico-left i-new"></i></button>
					<button data-action="open" type="button" class="btn btn-flat" title="${lang.open_font_title}"><i class="ico ico-left i-open"></i></button>
				</div>
				<div class="project-btns action-groups" style="float:right">
					<button data-disabled="1" data-action="save" type="button" class="btn btn-flat" title="${lang.save_proj}"><i class="ico ico-left i-save"></i></button>
					<div class="btn-group action-groups">
						<button type="button" class="btn btn-flat dropdown-toggle" data-toggle="dropdown"title="${lang.tool}">
							<i class="ico i-gear" ></i>
							<span class="drop ico i-down"></span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right" role="menu">
							<li><a data-disabled="1" data-action="setting-name"  >${lang.fontinfo}</a></li>
							<li><a data-disabled="1" data-action="setting-metrics">${lang.metrics}</a></li>
						</ul>
					</div>
				</div>
			</div>
            <div id="project-list" class="project-list"></div>
        </div>
		<div class="glyf-list-manager">
			<div class='glyf-list-title'>
					${lang.glyf}

					  <div class="btn-group action-groups">
						<button type="button" class="btn btn-flat dropdown-toggle" data-toggle="dropdown" title="${lang.tool}">
							<i class="ico i-gear" ></i>
							<span class="drop ico i-down"></span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right" role="menu">
							<li><a data-disabled="1" data-action="setting-editor">${lang.setting}</a></li>
							<li class="divider"></li>
							<li><a data-disabled="1" data-action="find-glyf">${lang.find_glyf}</a></li>
							<li class="divider"></li>
							<li><a data-disabled="1" data-action="setting-glyf-name">${lang.gen_glyph_name}</a></li>
							<li><a data-disabled="1" data-action="setting-glyf-clearname">${lang.clear_glyph_name}</a></li>
							<li><a data-disabled="1" data-action="setting-optimize">${lang.optimize_glyph}</a></li>
							<li><a data-disabled="1" data-action="setting-sort">${lang.sort_glyf}</a></li>
							<li><a data-disabled="1" data-action="setting-compound2simple">${lang.compound2simple}</a></li>
							<li class="divider"></li>
							<li><a data-disabled="1" data-action="setting-glyf-generate-template">1. ${lang.generate_glyf_name_template}</a></li> 
							<li><a data-disabled="1" data-action="setting-make-korean-glyf">2. ${lang.make_korean_glyf}</a></li>                             
						</ul>
					</div>
					 <div class="btn-group action-groups">
						<button type="button" class="btn btn-flat dropdown-toggle" data-toggle="dropdown" title="${lang.open}">
							<i class="ico i-open" ></i>
							<span class="drop ico i-down"></span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right" role="menu">
							<li><a data-disabled="1" data-action="import"  title="${lang.import_svg_title}">${lang.import} - ${lang.import_svg}</a></li>
							<li><a data-disabled="1" data-action="import-pic"  title="${lang.import_pic_title}">${lang.import} - ${lang.import_pic}</a></li>
							<li><a data-disabled="1" data-action="import"  title="${lang.import_font_title}">${lang.import} - ${lang.import_font}</a></li>
							<li><a data-disabled="1" data-action="add-online">${lang.onlinefont}</a></li>
							<li><a data-disabled="1" data-action="add-url">${lang.fonturl}</a></li>
						</ul>
					  </div>
			        <ul id="glyf-list-commandmenu" class="command-groups"></ul>
			</div>
			<div id="glyf-list-view">
				<div id="glyf-list-pager" class="pager"></div>
				<div id="glyf-list" class="glyf-list"></div>
			</div>
        </div>
		
    </section>

    <section class="main editing">

    </section>

    <section class="editor editing">
        <ul id="editor-commandmenu" class="command-groups"></ul>
		<div id="glyf-editor" class="glyf-editor" oncontextMenu="return false"></div>
        <ul id="editor-commandmenu-bottom" class="command-groups-bottom"></ul>
    </section>


    <div class="modal" id="model-dialog" tabindex="-1" role="dialog" aria-labelledby="model-label" aria-hidden="true" data-backdrop="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>
            <h4 class="modal-title" id="model-label">${lang.setting}</h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-flat" data-dismiss="modal">${lang.cancel}</button>
            <button type="button" class="btn btn-flat btn-confirm">${lang.confirm}</button>
          </div>
        </div>
      </div>
    </div>


    <div id="selection-range" class="selection-range"></div>
    <div id="loading" class="loading"><span>${lang.msg_loading}</span></div>


    <form id="font-form" style="width:0px;height:0px;overflow:hidden;"><input id="font-import" type="file" multiple="multiple"></form>
    <iframe id="sync-frame" name="sync-frame" width="0" height="0" frameborder="0" style="display:none;"></iframe>
    <script src="./dep/esl.js"></script>
    <script src="./dep/jquery.min.js"></script>
    <script src="./dep/jqColorPicker.min.js"></script>
    <script src="./dep/bootstrap/js/bootstrap.min.js"></script>
    <script src="./dep/paper-full.js"></script>
    <script src="./dep/hidpi-canvas.js"></script>
    <script>
        window.language = '${lang.lang}';
        require.config({
            baseUrl: './src',
            packages: [
                {
                    name: 'fonteditor-core',
                    location: '../dep/fonteditor-core/src'
                }
            ],
            paths: {
                utpl: '../dep/utpl.min',
                JSZip: '../dep/jszip/jszip.min',
                inflate: '../dep/pako_inflate.min',
                deflate: '../dep/pako_deflate.min'
            }
        });
        define('jquery', window.jQuery);
        paper.install(window);
        define('paper', window.paper);
        require(['fonteditor/main'])
    </script>
</body>
</html>
