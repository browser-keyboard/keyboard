self.port.on('create', function(params){
	keyboardOption.languageSet = params.languageList;
	virtualKeyboard = new Keyboard(keyboardOption, params.userOptions);
});
self.port.on('destroy', function(){	
	virtualKeyboard.destroy();
  delete virtualKeyboard;
});	
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

self.port.on('keyDown', function(params){
	virtualKeyboard.codeToKeyDown(params);
});
self.port.on('keyUp', function(params){
	virtualKeyboard.codeToKeyUp(params);
});
self.port.on('changeSymbols', function(params){
	virtualKeyboard.setKStutus(params);
});

/*****************************************************************************************/
$(window).blur(function(){
	virtualKeyboard.browserBlur();
});

$(window).focus(function(){
	virtualKeyboard.browserFocus();
});
