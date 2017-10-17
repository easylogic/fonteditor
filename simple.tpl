<!DOCTYPE html>
<html lang="${lang.lang}">
<head>
    <meta charset="UTF-8">
    <title>FontMoa - FontEditor</title>

    <meta name="generator" content="Fontmoa v1.0.9">
    <meta name="description" content="한글 폰트를 쉽게 다루기 위해서 만든 폰트 에디터, FontEditor, 폰트모아, Fontmoa, Simple Font Editor for TTF">
    
    <!-- Meta for Facebook -->
    <meta property="og:title" content="Fontmoa - 한글 폰트 에디터 , Font Editor, 폰트모아 ">
    <meta property="og:type" content="website">
    <!--<meta property="og:image" content="https://example.com/image-to-be-shown-in-facebook.jpg">-->
    <meta property="og:description" content="한글 폰트를 좀 더 다루기 쉽게 하기 위해서 만들어진 폰트 에디터, FontEditor, Simple Font Editor for TTF">
    
    <!-- Meta for Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@fontmoa">
    <meta name="twitter:creator" content="@easylogic">
    <meta name="twitter:title" content="Fontmoa - 한글 폰트 에디터 , Font Editor, 폰트모아">
    <meta name="twitter:description" content="한글 폰트를 좀 더 다루기 쉽게 하기 위해서 만들어진 폰트 에디터, FontEditor, Simple Font Editor for TTF">
    <!--<meta name="twitter:image" content="https://example.com/image-to-be-shown-in-twitter.jpg"> -->
 	
	<!-- Global Site Tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-107292462-1"></script>	
    <link rel="shortcut icon" href="/images/ico/icon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="./dep/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="./css/main.css">
	<style type="text/css" id="simple-font">
		
	</style>
</head>
<body class='simple-mode only-editor show-sidebar show-main show-editor'>

	<div class="page">

		<header id="header">      
			<div class="navbar" role="banner">
				<div class="container">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>

						<a class="navbar-brand" href="/">
							<h1 style='vertical-align:middle' title="If the font falls from the cloud"><img src="./css/img/icon.png" alt="logo" width="40px" align="absmiddle">ontMoa </h1>
						</a>
						
					</div>
					<div class="collapse navbar-collapse">
						<ul class="nav navbar-nav navbar-right">
							<li ><a href="/">Home</a></li>
							<li ><a href="/fontmoa/">Font Manager</a></li>
							<li class='active'><a href="/editor/v1/simple.html">Font Editor</a></li>						
							<li ><a href="/font/">Web Font</a></li>
							<li ><a href="/icon/">Icon Font</a></li>
						</ul>
					</div>

				</div>
			</div>
		</header>


		<section class="sidebar">
			<div class="project">
				<div class="project-title">
					<div class="project-btns action-groups">
						<button data-action="new" type="button" class="btn btn-flat" title="${lang.new_font_title}"><i class="ico ico-left i-new"></i> ${lang.new_font_title}</button>
						<button data-action="open" type="button" class="btn btn-flat" title="${lang.open_font_title}"><i class="ico ico-left i-open"></i> ${lang.open_font_title_2}</button>
					</div>
					<div class="project-btns action-groups" style="float:right">
						<button data-action="save" type="button" class="btn btn-flat"><i class="ico ico-left i-save"></i> ${lang.save_proj}</button> | 
						<button data-disabled="1" data-action="setting-name" class="btn btn-flat" >${lang.fontinfo}</button>
						<button data-disabled="1" data-action="setting-metrics" class="btn btn-flat">${lang.metrics}</button>
					</div>
				</div>
				<div id="project-list" class="project-list"></div>
			</div>
			<div class="glyf-list-manager">
				<div class='glyf-list-title action-groups'>
						${lang.glyf} <span class='glyf-total-count'></span>

						<span style='padding-right:40px;'></span>
						<a data-disabled="1" data-action="setting-glyf-generate-template">1. ${lang.generate_glyf_name_template}</a>
						<span style='padding-right:40px;'></span>
						<a data-disabled="1" data-action="setting-make-korean-glyf">2. ${lang.make_korean_glyf}</a>


						<div class="btn-group action-groups">
							<button type="button" class="btn btn-flat dropdown-toggle" data-toggle="dropdown" title="${lang.tool}">
								<i class="ico i-gear" ></i> ${lang.tool}
								<span class="drop ico i-down"></span>
							</button>
							<ul class="dropdown-menu dropdown-menu-right" role="menu">
								<li><a data-disabled="1" data-action="find-glyf">${lang.find_glyf}</a></li>
								<li class="divider"></li>
								<li><a data-disabled="1" data-action="setting-glyf-name">${lang.gen_glyph_name}</a></li>
								<li><a data-disabled="1" data-action="setting-glyf-clearname">${lang.clear_glyph_name}</a></li>
								<li><a data-disabled="1" data-action="setting-optimize">${lang.optimize_glyph}</a></li>
								<li><a data-disabled="1" data-action="setting-sort">${lang.sort_glyf}</a></li>
								<li><a data-disabled="1" data-action="setting-compound2simple">${lang.compound2simple}</a></li>
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
							<button data-disabled="1" data-action="import" class="btn btn-flat" title="${lang.import}"><i class="ico ico-left i-add"></i> ${lang.import}(svg,font)</button>
							
						</div>
						<ul id="glyf-list-commandmenu" class="command-groups"></ul>
				</div>
				<div id="glyf-list-view">
					<div id="glyf-list-pager" class="pager"></div>
					<div id="glyf-list" class="glyf-list"></div>
				</div>
			</div>
			
		</section>

		<section class="main editing"></section>

		<div class="editor-area">

			<div class="glyf-selector-tabs">
				<span class="tab-item  selected" data-value="project">${lang.tabs_project}</span>
				<span class="tab-item" data-value="classic">${lang.tabs_glyf}</span>
				<span class="tab-item" data-value="simple">${lang.tabs_simple}</span>
				<span class="tab-item" data-value="subsetting">${lang.tabs_subsetting}</span>			
				<span class="tab-item" data-value="fullscreen">${lang.tabs_fullscreen}</span>							
				<span class="tab-tools">
					<section class="toolbar action-groups" role="tools">
						<a class='btn btn-flat' data-action="download-glyf" title="${lang.export_image}"><i class='ico i-file-image'></i></a>
						<!--<a class='btn btn-flat' data-action="export" data-type="otf" title="${lang.export_otf}"><i class="ico i-ttf"></i></a> -->
						<a class='btn btn-flat' data-action="export" data-type="ttf" title="${lang.export_ttf}"><i class="ico i-ttf"></i></a>
						<a class='btn btn-flat' data-action="export" data-type="woff" title="${lang.export_woff}"><i class="ico i-woff"></i></a>
						<a class='btn btn-flat' data-action="export" data-type="zip" title="${lang.export_zip}"><i class="ico i-zip"></i></a>
						<a data-disabled="1" data-action="setting-editor" class='btn btn-flat'><i class="ico i-gear" ></i> ${lang.setting}</a>
						<div class="btn-group action-groups">
							<button type="button" class="btn btn-flat dropdown-toggle" data-toggle="dropdown">
								<i class="ico i-link" ></i> ${lang.language}
								<span class="drop ico i-down"></span>
							</button>
							<ul class="dropdown-menu dropdown-menu-right" role="menu">
								<li><a href="simple.html" title="${lang.korean}">${lang.korean}</a></li>
								<li><a href="simple-en.html" title="${lang.english}">${lang.english}</a></li>
								<li><a href="simple-cn.html" title="${lang.chinese}">${lang.chinese}</a></li>
								<li class='divider'></li>
								<li><a href='${lang.advanced_mode_link}'>Advanced  mode</a></li>
							</ul>
						</div>
						<a class="manual-link" href="https://fontmoa.gitbooks.io/fontmoa-fonteditor/" target="_manual"><i class="ico i-help"></i></a>
					</section>
				</span>
			</div>

			<div class="notebook notebook-left project-mode">

				<div class="simple-glyf-selector">
					<div class="text-view" >
						<div class="text-input" contenteditable="true" tabindex="-1" placeholder="${lang.write_a_text}"></div>
					</div>
					<div class="font-view-description  description">
						<label>${lang.font_size}</label> <span style="display:inline-block;width:200px;vertical-align:middle;"><input type="range" min="5" max="100" id="fontSize" style="width:100px;display:inline-block;vertical-align:middle;"/> <input type="number" min="5" max="100"  id="fontSizeInput"  style="width:60px;text-align:center;display:inline-block;vertical-align:middle;height:24px;"/> px</span>
						<label><input type="checkbox" checked id="guidChar"/> ${lang.view_guide_chars}</label>
						&nbsp;
						<button type="button" class="btn btn-flat delete-glyf pull-right">${lang.delete_glyf}</button>
					</div>
					<div class="font-view"></div>
				</div>
				<div class="classic-glyf-selector"> </div>
				<div class="project-glyf-selector"> </div>
				<div class="subsetting-glyf-selector">
					<div class="subsetting-tools">
						<div class="subsetting-download  action-groups">
							${lang.subsetting_download} 

							<a class='btn btn-flat' data-action="export" data-type="ttf" data-reduceGlyf="true" title="${lang.export_ttf}"><i class="ico i-ttf"></i></a>
							<a class='btn btn-flat' data-action="export" data-type="woff" data-reduceGlyf="true" title="${lang.export_woff}"><i class="ico i-woff"></i></a>
							<a class='btn btn-flat' data-action="export" data-type="zip" data-reduceGlyf="true" title="${lang.export_zip}"><i class="ico i-zip"></i></a>
						</div>
					</div>			
					<div class="subsetting-text-view" >
						<textarea id="subsetting-text" placeholder="${lang.write_a_custom_text}"></textarea>
					</div>
				</div>			
			</div>
			<div class="notebook notebook-container">
				<div class="notebook notebook-right">
					<div class="tools">
						<a class="extensions-open" href="#glyf-editor"><i class="ico i-gear" ></i></a>
					</div>
					<section class="editor editing">
						<ul id="editor-commandmenu" class="command-groups"></ul>
						<div id="glyf-editor" class="glyf-editor" oncontextMenu="return false"></div>
						<ul id="editor-commandmenu-bottom" class="command-groups-bottom"></ul>
					</section>
				</div>
				<div class="notebook notebook-options">
					
				</div>		
			</div>
		</div>

		
		<footer id="footer">
			<div class="container">
				<div class="row">
					<div class="col-sm-12 contact">
						<hr />
						<div >
							<address style="text-align:center">
							Contacts - 
							E-mail: <a href="mailto:cyberuls@gmail.com">cyberuls@gmail.com</a> <span class='divider'></span>
							Facebook: <a href="https://www.facebook.com/fontmoa">facebook.com/fontmoa</a> <span class='divider'></span>
							Twitter: <a href="https://www.twitter.com/fontmoa">@fontmoa</a>  <span class='divider'></span>
							Github: <a href="https://www.github.com/fontmoa">fontmoa</a> 
							</address>

						</div>
					</div>
					<div class="col-sm-12">
						<div class=" text-center">
							<p>&copy; Fontmoa 2017. All Rights Reserved.</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
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
				$("body").toggleClass('has-options');
			
				if ($(".notebook-options .innerdialog.show").length == 0) {
					accordian_resize($(".notebook-options .innerdialog:first .title"));
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

				var tab = $(this).data('value');
				var $notebook = $(".notebook-left");

				if (tab == 'classic') {
					$notebook.addClass('classic-mode').removeClass('project-mode simple-mode subsetting-mode fullscreen-mode');
				} else if (tab == 'project') {
					$notebook.addClass('project-mode').removeClass('classic-mode simple-mode subsetting-mode fullscreen-mode');
				} else if (tab == 'subsetting') {
					$notebook.addClass('subsetting-mode').removeClass('project-mode classic-mode simple-mode fullscreen-mode');	
				} else if (tab == 'simple') {
					$notebook.addClass('simple-mode').removeClass('classic-mode project-mode subsetting-mode fullscreen-mode');
				} else if (tab == 'fullscreen') {
					$notebook.addClass('fullscreen-mode').removeClass('classic-mode project-mode subsetting-mode simple-mode');					
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
				var inputText = $(".text-input").text();
				

				/* support unicode String for code point */
				var matches = inputText.match(/(\\\u[0-9a-zA-Z]{2,4})/gi) || [];

				for(var i = 0, len = matches.length ; i < len; i++) {
					var  m = matches[i];
					var codePoint = parseInt(m.split('u')[1], 16);
					var unicodeString = String.fromCodePoint(codePoint);

					inputText = inputText.replace(m, unicodeString);
				}
				
				var arr = inputText.split('');

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
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments)};
	  gtag('js', new Date());

	  gtag('config', 'UA-107292462-1');
	</script>
</body>
</html>
