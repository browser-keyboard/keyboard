var switches = document.querySelectorAll('input[type="checkbox"].ios-switch');

for (var i=0, sw; sw = switches[i++]; ) {
	var div = document.createElement('div');
	div.className = 'switch';
	sw.parentNode.insertBefore(div, sw.nextSibling);
}

var list = [];
self.port.on('languageList', function(languageList){
	var languageNames = [];
	var ul = $('#lang');
	ul.empty();
	list.length = 0;

	for (var i = 0; i < languageList.length; i++) {
		languageNames[i] = languageList[i].name;
		var li = $('<li>');
		li.attr('active', false);
		li.data('value', i);
		li.text(languageNames[i]);
		li.click(function(){
			self.port.emit('changeLanguage', $(this).data('value'));
      $('#lang li').attr('active', 'false');
      list[$(this).data('value')].attr('active', 'true');
			if(!$('#isActive').is(':checked')){
				f_active(true);
				$('#isActive').prop('checked', true);
			}
		});
		list.push(li);
		ul.append(li);
	}
	list[0].attr('active', 'true');
});

self.port.on('changeLanguage', function(i){
	$('#lang li').attr('active', 'false');
	list[i].attr('active', 'true');
});

var isActiveTime = false;
self.port.on('activision', function(params){
	$('#isActive').prop('checked', params);
	isActiveTime = true;
	setTimeout(function(){
		isActiveTime = false;
	}, 12);
});

$('#isActive').change(function(){
	if(!isActiveTime)
		self.port.emit('activision', $(this).is(':checked'));
});

$('#open-options').click(function(){
  self.port.emit('openOptions');
});
