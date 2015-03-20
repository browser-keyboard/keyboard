var created = false;

if(self==window.top){
  chrome.runtime.onMessage.addListener(function(data){
    switch(data.eve){
      case 'create':
	onPageCreateTop();
	tabActivate(data.kStatus);
	break;
      case "tabActivate":
	tabActivate(data.kStatus);
	break;
    }
  })
}else{ 
  chrome.runtime.onMessage.addListener(function(data){
    switch(data.eve){
      case 'create':
	setTimeout(onPageCreateChild, 120);
	break;
    }
  })
}

var selector = 'textarea, input, [contentEditable]';
var nonSelector = ':password, :button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';

keyboardConnection = function(virtualKeyboard){

    $('html').on('focus', selector, function(e){
      if($(this).is(nonSelector))
        return false;
       virtualKeyboard.setField(this, self);
     });
    
    $('html').on('focus', 'input:password', function(e){
       virtualKeyboard.setField(this, self, {animate: false});
     });
    
    $('html').on('blur', selector, function(){
      virtualKeyboard.fieldBlur();
    });

    $('html').on('keydown', "body", function(e){
      virtualKeyboard.keyDown(e);
    });
    $('html').on('keyup', "body", function(e){
      virtualKeyboard.keyUp(e);
    });
    $(window).blur(function(){
      virtualKeyboard.browserBlur();
    });

    $(window).focus(function(){
      virtualKeyboard.browserFocus();
    });

};

onPageCreateTop = function(){  
  window.virtualKeyboard = new Keyboard(keyboardOption);
  keyboardConnection(window.virtualKeyboard);
  /*
  // если скрипт не запустился в iframe (костыль для ckeditor)
  setTimeout(function(){
    setInterval(function(){
      for(var i = 0; i < window.frames.length ; i++){
        if(!window.frames[i].virtualKeyboard){
          window.frames[i].virtualKeyboard = true;
          try {
	    content = $(window.frames[i].document).contents().find('body').parent();
            content.on('focus', selector, function(e){
              if($(this).is(nonSelector))
                return false;
               virtualKeyboard.setField(this, e.view.window);
              });
            content.on('focus', 'input:password', function(e){
               virtualKeyboard.setField(this, e.view.window, {animate: false});
              });
            content.on('blur', selector, function(){
               virtualKeyboard.fieldBlur();
             });
            content.on('keydown', selector, function(e){
               virtualKeyboard.keyDown(e);
             });
            content.on('keyup', selector, function(e){
               virtualKeyboard.keyUp(e);
             });
            $(window.frames[i].window).blur(function(){
              virtualKeyboard.browserBlur();
            });
            $(window.frames[i].window).focus(function(){
              virtualKeyboard.browserFocus();
            });            
          } catch(e){}
        }
      }
    }, 150);
  }, 150);
  */
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
  
  created = true;
}

var onPageCreateChild = function(){
  parent.$(function(){
    window.virtualKeyboard = parent.window.virtualKeyboard; 
    keyboardConnection(window.virtualKeyboard);
  });  
}

var tabActivate = function(newKStatus){
  if(!created)
    return;
  window.virtualKeyboard.changeKStutus(newKStatus);
}
