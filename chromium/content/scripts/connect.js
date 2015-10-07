var created = false;

var HANDLE_SELECTORS = 'textarea, input, [contentEditable]';
var NON_HANDLE_SELECTORS = ':password, :button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';

var tabActivate = function(){
  if(created === 1)
    return;
  if(!created){
    topCreate();
  }
  else{
    chrome.storage.local.get(["kStatus"], function (result) {
      window.virtualKeyboard.synchronize(result.kStatus);
    });
  }
}

topCreate = function(){
  if((document.URL.indexOf("https://www.google.ru/_/chrome/newtab") != -1) || (document.URL.indexOf("https://docs.google.com") != -1))
		return;
  if(created)
    return;
  created = 1;
	chrome.storage.local.get(['languageList', 'userOptions', 'kStatus'], function (result) {
		keyboardOption.languageSet = result.languageList;
		window.virtualKeyboard = new Keyboard(keyboardOption, result.userOptions);
		window.virtualKeyboard.synchronize(result.kStatus);
		keyboardConnectionOn();
		created = true;
		if(result.userOptions.toShowOption != 'newer')
      $(window).on('resize',f_windowResize);
		ckeditorKludge();
    $(setFocusIfAutofocus);
	});
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

var childActive = function(){
  if(created)
    return;
  if(parent.window.created)
    childCreate();
}

var childCreate = function(){
	// create link to top object
	// создает ссылку на глобальный объект
  window.virtualKeyboard = parent.window.virtualKeyboard;
  keyboardConnectionOn();
  created = true;
}

var childDestroy = function(){
  keyboardConnectionOff();
  created = false;
}

keyboardConnectionOn = function(){
	// set events
	setTimeout(function(){
		$('html').on('focus', HANDLE_SELECTORS, f_focus);
		$('html').on('focus', 'input:password',f_focusPassport);
		$('html').on('blur', HANDLE_SELECTORS, f_blur);
		$('html').on('keydown', HANDLE_SELECTORS, f_keyDown);
		$('html').on('keyup', HANDLE_SELECTORS, f_keyUp);
		$(window).blur(f_windowBlur);
		$(window).focus(f_windowFocus);
	},1000)
};

keyboardConnectionOff = function(){
	// unset events
  $('html').off('focus', HANDLE_SELECTORS, f_focus);
  $('html').off('focus', 'input:password',f_focusPassport);
  $('html').off('blur', HANDLE_SELECTORS, f_blur);
  $('html').off('keydown', HANDLE_SELECTORS, f_keyDown);
  $('html').off('keyup', HANDLE_SELECTORS, f_keyUp);
  $(window).off("blur", f_windowBlur);
  $(window).off("focus", f_windowFocus);
};

var f_focus = function(e){
  if($(this).is(NON_HANDLE_SELECTORS))
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
	var container = window.virtualKeyboard.visual.container;
	var top = container.position().top;
	var left = container.position().left;
	if((top + container.height() > $(window).height())){
    container.data('plugin_pep').yToBorder();
	}
	if((left + container.width() > $(window).width())){
    container.data('plugin_pep').xToBorder();
	}
}

var ckeditorKludge = function(){
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
            content.on('focus', HANDLE_SELECTORS, function(e){
              if(!created) return;
              if($(this).is(NON_HANDLE_SELECTORS))
                return false;
              virtualKeyboard.setField(this, e.view.window);
            });
            content.on('focus', 'input:password', function(e){
              if(!created) return;
              virtualKeyboard.setField(this, e.view.window, {animate: false});
            });
            content.on('blur', HANDLE_SELECTORS, function(){
              if(!created) return;
              virtualKeyboard.fieldBlur();
            });
            content.on('keydown', HANDLE_SELECTORS, function(e){
              if(!created) return;
              virtualKeyboard.keyDown(e);
            });
            content.on('keyup', HANDLE_SELECTORS, function(e){
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
}

var setFocusIfAutofocus = function(){
  if(document.activeElement != document.getElementsByTagName('body')[0]){
      // если при загрузки странницы установлен автофокус на текстовом поле
      if($(document.activeElement).is('input:password')){
        virtualKeyboard.setField(document.activeElement, self, {animate: false});
        return;
      }
      if($(document.activeElement).is(NON_HANDLE_SELECTORS)){
        return false;
      }
      virtualKeyboard.setField(document.activeElement, self);
  }
}
if(self==window.top){
  chrome.runtime.onMessage.addListener(function(data){
    switch(data.eve){
      case "changeKStatus":
				tabActivate();
				break;
      case "active":
        if(!data.isActive)
          turnOff();
        else
          tabActivate();
				break;
      case "rebult":
        turnOff();
        tabActivate();
				break;
    }
  })
}else{
  childActive();
  chrome.runtime.onMessage.addListener(function(data){
    switch(data.eve){
      case 'to_destroy_child':
        childDestroy();
        break;
    }
  })
}
