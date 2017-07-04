define(function () {return '<div class="form-inline">\r\n  <div class="input-group input-group-sm">\r\n    <span class="input-group-addon">unicode</span>\r\n    <input data-field="unicode" data-type="unicode" placeholder="unicode" class="form-control">\r\n  </div>\r\n  <div class=\'help\'>${lang.dialog_glyf_unicode_example}</div>\r\n</div>\r\n<div class="form-inline">\r\n  <div class="input-group input-group-sm">\r\n    <span class="input-group-addon">${lang.glyph_name}</span>\r\n    <input data-field="name" class="form-control" placeholder="${lang.glyph_name}">\r\n  </div>\r\n</div>\r\n<div class="form-inline">\r\n  <div class="input-group input-group-sm">\r\n    <span class="input-group-addon">${lang.left_side_bearing}</span>\r\n    <input data-field="leftSideBearing" type="number" min="-16384" max="16384" step="1" class="form-control" placeholder="${lang.left_side_bearing}">\r\n  </div>\r\n</div>\r\n<div class="form-inline">\r\n  <div class="input-group input-group-sm">\r\n    <span class="input-group-addon">${lang.right_side_bearing}</span>\r\n    <input data-field="rightSideBearing" type="number" min="-16384" max="16384" step="1" class="form-control" placeholder="${lang.right_side_bearing}">\r\n  </div>\r\n</div>\r\n';});