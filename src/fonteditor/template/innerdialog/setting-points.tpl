{% if (typeof points != 'undefined') { _.each(points, function (p, i) { %}
<div class="point-group {%=( p.current ? 'current' : '')%} " data-index="{%=i%}">
  <div class="input-group input-group-sm">
	<label>{%=i%}</label>
	<span>X </span>
	<input data-field="x" value="{%=p.x%}" type="number" min="-16384" max="16384" step="1"/>
	<span>Y </span>
	<input data-field="y" value="{%=p.y%}"  type="number" min="-16384" max="16384" step="1"/>
	<span>onCurve </span>
	<input data-field="onCurve" type="checkbox"  {%=( p.onCurve ? 'checked="true"' : '')%} />
	<span class='del-btn'><i class='ico i-del'></i><span>
  </div>
</div>
{% }); } %}