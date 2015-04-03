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

chrome.storage.local.get(["languageList", "kStatus"], function(data){
  lSet = data.languageList;
  var cur_active = data.kStatus.language.value;
  for (var i = 0; i < lSet.length; i++) {
    languageNames[i] = lSet[i].name;
    var boll = cur_active == i;
    var li = $('<li data-value = "' + i + '" active="' + boll +'">' + languageNames[i] + '</li>');
    li.click(function(){
      f_changeLanguage( $(this).data('value'));
      $('#lang li').attr('active', 'false');
      list[$(this).data('value')].attr('active', 'true');
    });
    list.push(li);
    ul.append(li);
  }
  
  
});

chrome.storage.local.get(["isActive"], function(data){
  $('#isActive').prop('checked', data.isActive);
  
  $('#isActive').change(function(){
    f_active($(this).is(':checked'));
  });
});

$('#open-options').click(function(){
  chrome.tabs.create({ "url": "chrome-extension://" + chrome.runtime.id + "/options/index.html"});
});

});