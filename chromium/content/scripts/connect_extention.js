var created = false;

var selector = 'textarea, input, [contentEditable]';
var nonSelector = ':password, :button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';

var f_focus = function(e){
  if($(this).is(nonSelector))
    return false;
  window.virtualKeyboard.setField(this, self);
}
var f_focusPassport = function(e){
  window.virtualKeyboard.setField(this, self, {animate: false});
}
var f_blur = function(e){
	window.virtualKeyboard.fieldBlur();

}
var f_keyDown =  function(e){
  window.virtualKeyboard.keyDown(e);
}
var f_keyUp = function(e){
  window.virtualKeyboard.keyUp(e);
}
var f_windowBlur = function(){
  window.virtualKeyboard.browserBlur();
}
var f_windowFocus = function(){
  window.virtualKeyboard.browserFocus();
}
var f_windowResize = function(){
	var con = window.virtualKeyboard.visual.container;
	var top = con.position().top;
	var left = con.position().left;
	if((top + con.height() > $(window).height())){
		con.data('plugin_pep').yToBorder();
	}
	if((left + con.width() > $(window).width())){
		con.data('plugin_pep').xToBorder();
	}
}


keyboardConnectionOn = function(){
	// set events
	setTimeout(function(){
		$('html').on('focus', selector, f_focus);    
		$('html').on('focus', 'input:password',f_focusPassport);    
		$('html').on('blur', selector, f_blur);
		$('html').on('keydown', selector, f_keyDown);
		$('html').on('keyup', selector, f_keyUp);
		$(window).blur(f_windowBlur);
		$(window).focus(f_windowFocus);
	},1000) 
};
keyboardConnectionOff = function(){
	// unset events
  $('html').off('focus', selector, f_focus);    
  $('html').off('focus', 'input:password',f_focusPassport);    
  $('html').off('blur', selector, f_blur);
  $('html').off('keydown', selector, f_keyDown);
  $('html').off('keyup', selector, f_keyUp);
  $(window).off("blur", f_windowBlur);
  $(window).off("focus", f_windowFocus);
};

createTop = function(){  
  if(document.URL.indexOf("https://www.google.ru/_/chrome/newtab") != -1)
		return;
  if(document.URL.indexOf("https://docs.google.com") != -1)
		return;
  if(created)
    return;
  created = 1;
	chrome.storage.local.get(['languageList', 'userOptions', "kStatus"], function (result) {	
		keyboardOption.languageSet = result.languageList;
		window.virtualKeyboard = new Keyboard(keyboardOption, result.userOptions);
		window.virtualKeyboard.changeKStutus(result.kStatus);
		keyboardConnectionOn();
		created = true;
		$(window).on('resize',f_windowResize);
		// если скрипт не запустился в iframe (костыль для ckeditor)
		// if script was not run on iframe (its for ckeditor)
		setTimeout(function(){
			setInterval(function(){
				if(!created)
					return;
				for(var i = 0; i < window.frames.length ; i++){
					if(!window.frames[i].virtualKeyboard){
						window.frames[i].virtualKeyboard = true;
						try {
							content = $(window.frames[i].document).contents().find('body').parent();
							content.on('focus', selector, function(e){
								if(!created) return;
								if($(this).is(nonSelector))
									return false;
								virtualKeyboard.setField(this, e.view.window);
								});
							content.on('focus', 'input:password', function(e){
								if(!created) return;
								virtualKeyboard.setField(this, e.view.window, {animate: false});
								});
							content.on('blur', selector, function(){
								if(!created) return;
								virtualKeyboard.fieldBlur();
							});
							content.on('keydown', selector, function(e){
								if(!created) return;
								virtualKeyboard.keyDown(e);
							});
							content.on('keyup', selector, function(e){
								if(!created) return;
								virtualKeyboard.keyUp(e);
							});
							$(window.frames[i].window).blur(function(){
								if(!created) return;
								virtualKeyboard.browserBlur();
							});
							$(window.frames[i].window).focus(function(){
								if(!created) return;
								virtualKeyboard.browserFocus();
							});            
						} catch(e){}
					}
				}
			}, 500);
		}, 500);
		$(function() {
			if(document.activeElement != document.getElementsByTagName('body')[0]){
				// если при загрузки странницы установлен автофокус на текстовом поле
				if($(document.activeElement).is('input:password')){
					virtualKeyboard.setField(document.activeElement, self, {animate: false});
					return;
				}
				if($(document.activeElement).is(nonSelector)){
					return false;
				}
				virtualKeyboard.setField(document.activeElement, self);    
			}
		});
	});
}

var createChild = function(){
	// create link to top object
	// создает ссылку на глобальный объект
  window.virtualKeyboard = parent.window.virtualKeyboard; 
  keyboardConnectionOn();
  created = true;
}
var destroyChild = function(){
  keyboardConnectionOff();
  created = false;
}
var childActive = function(){
  if(created)
    return;
  if(parent.window.created)
    createChild();
}

var tabActivate = function(){
  if(created === 1)
    return;
  if(!created){
    createTop();
  }
  else{
    chrome.storage.local.get(["kStatus"], function (result) {	
      window.virtualKeyboard.changeKStutus(result.kStatus);
    });
  }    
}

var turnOff = function(){
	if(!created)
		return;
  keyboardConnectionOff();
	$(window).off('resize',f_windowResize);
  window.virtualKeyboard.destroy();
  delete window.virtualKeyboard;
  created = false;
  chrome.runtime.sendMessage({eve: "to_destroy_child"});
}

var activision = function(){
  chrome.storage.local.get(["isActive"], function (result) {	
    if(!result.isActive){
      turnOff();
    }else
      tabActivate();
  });
}


var rebult = function(){
  turnOff();
  tabActivate();
}

if(self==window.top){
  chrome.runtime.onMessage.addListener(function(data){
    switch(data.eve){
      case "kStatus":
				tabActivate();
				break;
      case "active":
				activision();
				break;
      case "rebult":
				rebult();
				break;
    }
  })
}else{
  childActive();
  chrome.runtime.onMessage.addListener(function(data){
    switch(data.eve){
      case 'to_destroy_child':
        destroyChild();
	break;
    }
  })
}
