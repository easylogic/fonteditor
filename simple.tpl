<!DOCTYPE html>
<html lang="${lang.lang}">
<head>
    <meta charset="UTF-8">
    <title>FontMoa - FontEditor</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="./dep/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="./css/main.css">
	<style type="text/css" id="simple-font">
		
	</style>
</head>
<body class='simple-mode only-editor show-sidebar show-main show-editor'>

    <section class="navbar" role="navigation">
		<div class="container">
			<h1 class="logo"><a href="/" title="Welcome to Fontmoa!!">Fontmoa</a></h1>
			<span class='language'>
				<a href="simple.html" title="${lang.korean}">${lang.korean}</a>
				<a href="simple-en.html" title="${lang.english}">${lang.english}</a>
				<a href="simple-cn.html" title="${lang.chinese}">${lang.chinese}</a>
				<span class='divider'>|</span>
				<a class='change-editor' href='${lang.advanced_mode_link}'>Advanced  mode</a>				
				<a class="manual-link" href="https://easylogic.gitbooks.io/fontmoa-fonteditor/" target="_manual"><i class="ico i-help"></i> ${lang.help} </a>
			</span>
		</div>
    </section>


    <section class="toolbar action-groups" role="tools">
		<div class="container">
			${lang.download} 

			<a class='btn btn-flat' data-action="download-glyf" title="${lang.export_image}"><i class='ico i-file-image'></i></a>
			<!--<a class='btn btn-flat' data-action="export" data-type="otf" title="${lang.export_otf}"><i class="ico i-ttf"></i></a> -->
			<a class='btn btn-flat' data-action="export" data-type="ttf" title="${lang.export_ttf}"><i class="ico i-ttf"></i></a>
			<a class='btn btn-flat' data-action="export" data-type="woff" title="${lang.export_woff}"><i class="ico i-woff"></i></a>
			<a class='btn btn-flat' data-action="export" data-type="zip" title="${lang.export_zip}"><i class="ico i-zip"></i></a>

			|

			<a data-disabled="1" data-action="setting-editor" class='btn btn-flat'><i class="ico i-gear" ></i> ${lang.setting}</a>

		</div>
    </section>

    <section class="sidebar">
		<!--<div class="open-btn"><i class='ico i-gear'></i></div>-->
        <div class="project">
            <div class="project-title">${lang.project_list}
				<div class="project-btns action-groups">
					<button data-action="new" type="button" class="btn btn-flat" title="${lang.new_font_title}"><i class="ico ico-left i-new"></i> ${lang.new_font_title}</button>
					<button data-action="open" type="button" class="btn btn-flat" title="${lang.open_font_title}"><i class="ico ico-left i-open"></i> ${lang.open_font_title_2}</button>
				</div>
				<div class="project-btns action-groups" style="float:right">
					<button data-action="save" type="button" class="btn btn-flat" title="${lang.save_proj}"><i class="ico ico-left i-save"></i> ${lang.save_proj}</button> | 
					<button data-disabled="1" data-action="setting-name" class="btn btn-flat" title="${lang.fontinfo}" >${lang.fontinfo}</button>
					
					<!--
					<div class="btn-group action-groups">
						<button type="button" class="btn btn-flat dropdown-toggle" data-toggle="dropdown"title="${lang.tool}">
							<i class="ico i-gear" ></i> ${lang.tool}
							<span class="drop ico i-down"></span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right" role="menu">
							<li><a data-disabled="1" data-action="setting-name"  >${lang.fontinfo}</a></li>
							<li><a data-disabled="1" data-action="setting-metrics">${lang.metrics}</a></li>
						</ul>
					</div> -->
				</div>
			</div>
            <div id="project-list" class="project-list"></div>
        </div>
		<div class="glyf-list-manager">
			<div class='glyf-list-title'>
					${lang.glyf} <span class='glyf-total-count'></span>

					  <div class="btn-group action-groups">
						<button type="button" class="btn btn-flat dropdown-toggle" data-toggle="dropdown" title="${lang.tool}">
							<i class="ico i-gear" ></i> ${lang.tool}
							<span class="drop ico i-down"></span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right" role="menu">
							<!--<li><a data-disabled="1" data-action="setting-editor">${lang.setting}</a></li>
							<li class="divider"></li>-->
							<li><a data-disabled="1" data-action="find-glyf">${lang.find_glyf}</a></li>
							<!--<li class="divider"></li>-->
							<!--<li><a data-disabled="1" data-action="setting-glyf-name">${lang.gen_glyph_name}</a></li>-->
							<!--<li><a data-disabled="1" data-action="setting-glyf-clearname">${lang.clear_glyph_name}</a></li>-->
							<!--<li><a data-disabled="1" data-action="setting-optimize">${lang.optimize_glyph}</a></li>-->
							<li><a data-disabled="1" data-action="setting-sort">${lang.sort_glyf}</a></li>
							<!--<li><a data-disabled="1" data-action="setting-compound2simple">${lang.compound2simple}</a></li>-->
							<li class="divider"></li>
							<li><a data-disabled="1" data-action="setting-glyf-generate-template">1. ${lang.generate_glyf_name_template}</a></li> 
							<li><a data-disabled="1" data-action="setting-make-korean-glyf">2. ${lang.make_korean_glyf}</a></li> 
						</ul>
					</div>
					<!--
					 <div class="btn-group action-groups">
						<button type="button" class="btn btn-flat dropdown-toggle" data-toggle="dropdown" title="${lang.import}">
							<i class="ico i-open" ></i> ${lang.import}
							<span class="drop ico i-down"></span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right" role="menu">
							<li><a data-disabled="1" data-action="import"  title="${lang.import_svg_title}">${lang.import} - ${lang.import_svg}</a></li>
							<li><a data-disabled="1" data-action="import-pic"  title="${lang.import_pic_title}">${lang.import} - ${lang.import_pic}</a></li>
							<li><a data-disabled="1" data-action="import"  title="${lang.import_font_title}">${lang.import} - ${lang.import_font}</a></li>
							<li><a data-disabled="1" data-action="add-online">${lang.onlinefont}</a></li>
							<li><a data-disabled="1" data-action="add-url">${lang.fonturl}</a></li>
						</ul>
					  </div> -->
					  <div class="btn-group action-groups">
						<button data-action="add-new" type="button" class="btn btn-flat btn-new" title="${lang.newglyph}"><i class="ico ico-left i-add"></i> ${lang.newglyph}</button>
					    <button data-disabled="1" data-action="import" class="btn btn-flat" title="${lang.import}"><i class="ico ico-left i-add"></i> ${lang.import}</button>
						
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


	<div class="editor-area">

		<div class="glyf-selector-tabs">
			<div class="tab-item " data-value="project">Project</div>
			<div class="tab-item selected" data-value="classic">Classic</div>
			<div class="tab-item" data-value="simple">Simple</div>
		</div>
		<div class="notebook notebook-left classic-mode">

			<div class="simple-glyf-selector">
				<div class="text-view" >
					<div class="text-input" contenteditable="true" tabindex="-1" placeholder="${lang.write_a_text}"></div>
				</div>
				<div class="font-view-description  description">
					<label>${lang.font_size}</label> <span style="display:inline-block;width:200px;vertical-align:middle;"><input type="range" min="5" max="100" id="fontSize" style="width:100px;display:inline-block;vertical-align:middle;"/> <input type="number" min="5" max="100"  id="fontSizeInput"  style="width:60px;text-align:center;display:inline-block;vertical-align:middle;height:24px;"/> px</span>
					<label><input type="checkbox" checked id="guidChar"/> ${lang.view_guide_chars}</label>
					&nbsp;
					<button type="button" class="btn btn-flat delete-glyf">${lang.delete_glyf}</button>
				</div>
				<div class="font-view"></div>
			</div>
			<div class="classic-glyf-selector"> </div>
			<div class="project-glyf-selector"> </div>
		</div>
		<div class="notebook notebook-right">
			<div class="tools">
				<a class="extensions-open" href="#"><i class="ico i-gear" ></i></a>
			</div>
			<section class="editor editing">
				<ul id="editor-commandmenu" class="command-groups"></ul>
				<div id="glyf-editor" class="glyf-editor" oncontextMenu="return false"></div>
				<ul id="editor-commandmenu-bottom" class="command-groups-bottom"></ul>
			</section>
		</div>
		<div class="notebook notebook-options">
			
		</div>		
		<!--
		<div class="chain">
			<div class="ring"><div class="circle left"></div><div class="circle right"></div><div class="rect"></div></div>
			<div class="ring"><div class="circle left"></div><div class="circle right"></div><div class="rect"></div></div>
			<div class="ring"><div class="circle left"></div><div class="circle right"></div><div class="rect"></div></div>
			<div class="ring"><div class="circle left"></div><div class="circle right"></div><div class="rect"></div></div>
			<div class="ring"><div class="circle left"></div><div class="circle right"></div><div class="rect"></div></div>
		</div>
		-->
	</div>

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
	<script>
	if (window.require) {
		window.nodeRequire = window.require;
		delete window.require;
	}
	</script>
    <script src="./dep/esl.js"></script>
    <script src="./dep/jquery.min.js"></script>
    <script src="./dep/jqColorPicker.min.js"></script>
    <script src="./dep/bootstrap/js/bootstrap.min.js"></script>
    <script src="./dep/paper-full.js"></script>
    <script src="./dep/hidpi-canvas.js"></script>
    <script>
		window.$ = window.jQuery;
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
        require(['fonteditor/main'], function () {

			var backgroundIndex = Math.floor( (Math.random() * 9));
			if (backgroundIndex < 1) 	{ backgroundIndex = 1; }

			backgroundIndex = 7; 
			$("body").addClass('back-' + backgroundIndex);


			/*
			// 이건 스타일 다 바꿔야겠네. 
			// 일단 개별로 동작하던 방식을 버리고 다 같이 동작하도록 함. 
			// accordian  형태로 가야할 수도 있음. 
			//$("#innerdialog-setting-glyf").appendTo(".notebook-right");
			//$("#innerdialog-setting-shape-maker").appendTo(".notebook-right");

			// innder dialog 를 모두  편집기 오른쪽으로 배치함.  
			// 접었다 폈다 기능을 할 수 있도록 구조를 맞춤. */
			$(".notebook-options").append($(".main.editing").children());

			$(".glyf-list-manager").appendTo(".classic-glyf-selector");
			$(".project").appendTo(".project-glyf-selector");

			var $fontView = $(".font-view");

			
			$(".open-btn").on('click', function () {
				$('.navbar').toggleClass('on');
				$('.sidebar').toggleClass('on');
				$('.editor-area').toggleClass('on');
			});

			$("#fontSize").on('change' ,function () {
				var fontSize = $(this).val();
				$fontView.css('font-size', fontSize + 'px');
				$("#fontSizeInput")[0].value = fontSize;
			}).val(parseInt($fontView.css('font-size').replace('px', ''))).change();

			$("#fontSizeInput").on('change', function () {
				var fontSize = $(this).val();
				$fontView.css('font-size', fontSize + 'px');
				$("#fontSize").val(fontSize);
			});

			$("#guidChar").on('click', function () {
				$fontView.toggleClass('no-border', !$(this).prop('checked'));
			});	

			$(".extensions-open").on('click', function () {
				$(".editor-area").toggleClass('has-options');
			
				if ($(".notebook-options .innerdialog.show").length == 0) {
					accordian_resize($(".notebook-options").find(".innderdialog:first").find(".title"));
				}
			});

			$(".delete-glyf").on("click", function () {

				var $selected = $fontView.find(".selected");
				var text = $selected.text() || $selected.data('empty-ch');

				if (text == '&nbsp;')
				{
					text = ' ';
				}

				var codepoint = text.codePointAt(0);

				var unicode = codepoint;

				program.viewer.removeSelectedGlyf(unicode);

				/* 현재 선택된 것을 다시 클릭해서 처리 상태를 변경한다. */
				$($selected[0]).click();
			});

			$(".glyf-selector-tabs").on("click", ".tab-item", function () {
				$(this).parent().find(".selected").removeClass('selected');
				$(this).addClass('selected');

				if ($(this).data('value') == 'classic') {
					$(".notebook-left").addClass('classic-mode').removeClass('project-mode simple-mode');
				} else if ($(this).data('value') == 'project') {
					$(".notebook-left").addClass('project-mode').removeClass('classic-mode simple-mode');
				} else {
					$(".notebook-left").addClass('simple-mode').removeClass('classic-mode project-mode');
				}
			});

			$(".notebook-options").on('click', '.innerdialog .title', function () {
				var $title = $(this);
				accordian_resize($title);
			});

			function accordian_resize($title) {
				var $dialog = $title.parent();
				var $content = $dialog.find(".content");
				var count = $(".notebook-options").children().length; 

				var total_height = $(".notebook-options").outerHeight();
				var title_height = $title.outerHeight();

				var view_height = total_height - title_height * count; 

				$(".notebook-options").find(".innerdialog.show").removeClass('show');
				$dialog.addClass('show');
				$content.height(view_height);
			}

			var update_font_timer = null;
			function update_font() {
				if (window.program)
				{		
					if (update_font_timer) {
						clearTimeout(update_font_timer);
					}

					update_font_timer = setTimeout(function () {
						var cloneTTF = program.ttfManager.clone({ empty: true, reduceGlyf: $(".text-input").text(), optimize: true });
						var base64 = program.previewer.toBase64(cloneTTF.get());
						$("#simple-font").html("@font-face { font-family: simple; src: url('" + base64 + "'); }");
					}, 200);
				}
			}

			function init_text_select () {
				var arr = $(".text-input").text().split('');

				var temp = [];
				var pointList= [];
				for(var i = 0, len = arr.length; i < len; i++) {
					var ch = arr[i];
					var codepoint = arr[i].codePointAt(0);
			
					if (ch == ' ')
					{
						ch = '&nbsp;';
					}
					var glyf = "<span class='glyf' data-empty-ch='"+ch+"'>" + ch + "</span>";

					temp.push(glyf);
					pointList.push(codepoint);
				}

				return {
					template : temp,
					codepoint : pointList
				}
			}


			$(".text-input").on("keyup", function () {

				var unicodeChar = $fontView.find(".selected").data('empty-ch');
				var ret = init_text_select();


				var $span = $("<span />").html(ret.template);
				$(".font-view").html($span).data('codepoint', ret.codepoint);

				$(".font-view").find("[data-empty-ch='"+unicodeChar+"']").toggleClass('selected', true);

				update_font();
			});

			$(".font-view").on('click', '.glyf', function () {
				var self = this; 
				var width = $(self).width();
				var height = $(self).height();
				var text = $(this).text() || $(this).data('empty-ch');

				if (text == '&nbsp;')
				{
					text = ' ';
				}

				var codepoint = text.codePointAt(0);

				var unicode = codepoint;

				$fontView.find(".selected").removeClass('selected').each(function() {
					$(this).html($(this).data('empty-ch'));	
				});
				$fontView.find("[data-empty-ch='"+$(self).text()+"']").toggleClass('selected', true);
					
				program.viewer.showGlyfByUnicode(unicode, function (isEmptyChar) {
					var $char = $fontView.find("[data-empty-ch='"+$(self).text()+"']");
					if (isEmptyChar)
					{

						$char.empty();

						/*  이미지 편집기를 위에다 넣을까? 그런 다음 에디터를 보여줘? */
						var fontSize = 512;
						var fontFamily = $fontView.css('font-family').split(",").pop();
						program.fire('import-pic', {
							unicode : unicode,
							fontSize : fontSize,
							fontFamily : fontFamily,
							color: '#7a7a7a'
						});
					}
					
				});
			});

			program.editor.editor.on('save', function (opt) {
				$(".text-input").trigger("keyup");
			});

		});

    </script>
</body>
</html>
