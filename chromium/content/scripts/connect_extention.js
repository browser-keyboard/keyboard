$('html').keydown(function(event){
  if(event.ctrlKey && (event.keyCode == 75))
    chrome.runtime.sendMessage({eve: "activision", status: !created});
})

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
var f_blur = function(){
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

keyboardConnectionOn = function(){
  $('html').on('focus', selector, f_focus);    
  $('html').on('focus', 'input:password',f_focusPassport);    
  $('html').on('blur', selector, f_blur);
  $('html').on('keydown', "body", f_keyDown);
  $('html').on('keyup', "body", f_keyUp);
  $(window).blur(f_windowBlur);
  $(window).focus(f_windowFocus);
};
keyboardConnectionOff = function(){
  $('html').off('focus', selector, f_focus);    
  $('html').off('focus', 'input:password',f_focusPassport);    
  $('html').off('blur', selector, f_blur);
  $('html').off('keydown', "body", f_keyDown);
  $('html').off('keyup', "body", f_keyUp);
  $(window).off("blur", f_windowBlur);
  $(window).off("focus", f_windowFocus);
};

createTop = function(){  
  if(created)
    return;
  created = true;
    chrome.storage.local.get(['languageList'], function (result) {
      keyboardOption.languageSet = result.languageList;
      window.virtualKeyboard = new Keyboard(keyboardOption);
      keyboardConnectionOn();
      
      // если скрипт не запустился в iframe (костыль для ckeditor)
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
	}, 150);
      }, 150);
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
//      chrome.runtime.sendMessage({eve: "to_create_child"});
    });
}

var createChild = function(){
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

var tabActivate = function(newKStatus){
  if(!created){
    createTop();
    setTimeout(function(){
      window.virtualKeyboard.changeKStutus(newKStatus);
    },120);
  }
  else
    window.virtualKeyboard.changeKStutus(newKStatus);
}


var activision = function(status, kStatus){
  if(!status){
    keyboardConnectionOff();
    window.virtualKeyboard.destroy();
    delete window.virtualKeyboard;
    created = false;
    chrome.runtime.sendMessage({eve: "to_destroy_child"});
  }else
    tabActivate(kStatus);
}

var rebult = function(kStatus){
  activision(false);
  tabActivate(kStatus);
}

var showing = function(status){
  if(!created)
    return;
  if(status)
    window.virtualKeyboard.visual.show();
  else
    window.virtualKeyboard.visual.hide();
}


if(self==window.top){
  chrome.runtime.onMessage.addListener(function(data){
    switch(data.eve){
      case "kStatus":
	tabActivate(data.kStatus);
	break;
      case "active":
	activision(data.status, data.kStatus);
	break;
      case "rebult":
	rebult(data.kStatus);
	break;
      case "showen":
	showing(data.status);
	break;
    }
  })
}else{ 
  childActive();
  chrome.runtime.onMessage.addListener(function(data){
    switch(data.eve){
      case 'to_create_child':
	createChild();
	break;
      case 'to_destroy_child':
        destroyChild();
	break;
    }
  })
}