self.port.on('create', function(params){
	keyboardOption.languageSet = params.languageList;
	virtualKeyboard = new Keyboard(keyboardOption, params.userOptions);
	$(window).on('resize',f_windowResize);
});
self.port.on('destroy', function(){	
	$(window).off('resize',f_windowResize);
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

var f_windowResize = function(){
	var con = virtualKeyboard.visual.container;
	var top = con.position().top;
	var left = con.position().left;
	if((top + con.height() > $(window).height())){
		con.data('plugin_pep').yToBorder();
	}
	if((left + con.width() > $(window).width())){
		con.data('plugin_pep').xToBorder();
	}
}
