{% if (typeof CPAL != 'undefined') { console.log(CPAL);_.each(CPAL.colorRecords, function (color, i) { %}
<div class="color-group " data-index="{%=i%}">
  <div class="input-group input-group-sm">
	<label class='color' style='background-color: rgba({%=color.r%},{%=color.g%},{%=color.b%},{%=(Math.round((color.a/255* 100))/100)%})'></label>
    <span>R</span> 	<input data-field="r" value="{%=color.r%}" type="number" min="0" max="255" step="1"/>
    <span>G</span> 	<input data-field="g" value="{%=color.g%}" type="number" min="0" max="255" step="1"/>
    <span>B</span> 	<input data-field="b" value="{%=color.b%}" type="number" min="0" max="255" step="1"/>
    <span>A</span> 	<input data-field="a" value="{%=color.a%}" type="number" min="0" max="255" step="1"/>
	<span class='del-btn'><i class='ico i-del'></i><span>
  </div>
</div>
{% }); } %}