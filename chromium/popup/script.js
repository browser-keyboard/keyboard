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
    f_changeLanguage( $(this).data('value'));
  });
  list.push(li);
  ul.append(li);
}

chrome.storage.local.get(["isShow", "isActive"], function(data){
  $('#isActive').prop('checked', data.isActive);
  $('#isVisual').prop('checked', data.isShow);
  console.log(data);
  
  $('#isActive').change(function(){
    f_active($(this).is(':checked'));
  });
  $('#isVisual').change(function(){
    f_showen($(this).is(':checked'));
  });
});
});