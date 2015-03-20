// JS is only used to add the <div>s
$(function(){
var switches = document.querySelectorAll('input[type="checkbox"].ios-switch');

for (var i=0, sw; sw = switches[i++]; ) {
	var div = document.createElement('div');
	div.className = 'switch';
	sw.parentNode.insertBefore(div, sw.nextSibling);
}


var languageNames = [];
var ul = $('#lang');
var list = [];
for (var i = 0; i < keyboardOption.languageSet.length; i++) {
	languageNames[i] = keyboardOption.languageSet[i].name;
	var li = $('<li data-value = "' + i + '">' + languageNames[i] + '</li>');
	li.click(function(){
		self.port.emit('changeLanguage', $(this).data('value'));
	});
	list.push(li);
	ul.append(li);
}

self.port.on('changeLanguage', function(i){
	$('#lang li').attr('active', 'false');
	list[i].attr('active', 'true');
});

var isShowTime = false;
self.port.on('showing', function(params){
	$('#isVisual').prop('checked', params);
	isShowTime = true;
	setTimeout(function(){
		isShowTime = false;
	}, 12);
});

$('#isVisual').change(function(){
	if(!isShowTime)
		self.port.emit('showing', $(this).is(':checked'));
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

});
