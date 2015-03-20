(function($) {
$(function(){
				 
	var virtualKeyboard = new Keyboard(keyboardOption);
		self.port.on('setField', function(params){
			virtualKeyboard.setField(params);
		});
  	self.port.on('blurField', function(){
			virtualKeyboard.fieldBlur();
		});
  	self.port.on('browserBlur', function(){
			virtualKeyboard.browserBlur();
		});
  	self.port.on('browserFocus', function(){
			virtualKeyboard.browserFocus();
		});
		
		self.port.on('KeyFunctionalVisual', function(params){
			virtualKeyboard.visualKeyFunct(params);
		});
		self.port.on('keyDown', function(params){
			if(virtualKeyboard.visual.active)
				virtualKeyboard.codeToKeyDown(params);
		});
		self.port.on('keyUp', function(params){
			if(virtualKeyboard.visual.active)
				virtualKeyboard.codeToKeyUp(params);
		});
		self.port.on('changeLanguage', function(params){
			virtualKeyboard.changeLanguage(params);
		});
		self.port.on('changeSymbols', function(params){
		  console.log('visual.Keyboard called by changeSymbols', params );
		  virtualKeyboard.changeSymbolicks(params);
		});
		self.port.on('showing', function(params){
			params = params ? params : false;
			if(params){
				virtualKeyboard.visual.show();
			}else{
				virtualKeyboard.visual.hide();
			}
		});
		
		
		/*****************************************************************************************/
		$(window).blur(function(){
			virtualKeyboard.browserBlur();
		});

		$(window).focus(function(){
			virtualKeyboard.browserFocus();
		});
});
		
})(jQuery);

