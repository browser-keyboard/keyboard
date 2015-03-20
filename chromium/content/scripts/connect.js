
(function($) {
$(function(){
	
  if(self==window.top){
  	var virtualKeyboard = new Keyboard(keyboardOption);
  }

  
  var selector = 'textarea, input, [contentEditable]';
  var nonSelector = ':password, :button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';

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
		if(!virtualKeyboard.active)
			return;
  	virtualKeyboard.keyDown(e);
	console.log(e);
  });
  $('html').on('keyup', "body", function(e){
  	if(e.ctrlKey && e.keyCode == 77){
  		virtualKeyboard.reverse();
  	}else{
  		if(!virtualKeyboard.active)
  			return;
    	virtualKeyboard.keyUp(e);
  	}
  });
  $(window).blur(function(){
  	virtualKeyboard.browserBlur();
  });

  $(window).focus(function(){
  	virtualKeyboard.browserFocus();
  });

  setInterval(function(){
  	for(var i = 0; i < window.frames.length ; i++){
			if(!window.frames[i].keyboardConnect){
				window.frames[i].keyboardConnect = true;

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
			}
  	}
  	
  }, 150);  
});
})(jQuery);

