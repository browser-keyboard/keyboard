var getKeyParams = function(e){
	var params = {};
	params.keyCode = e.originalEvent.code;
	params.shitfKey = e.shiftKey;
	params.ctrlKey = e.ctrlKey;
	params.altKey = e.ctrlKey;
	return params;
}

var ifKeyboard;
self.port.on('create', function(params){
	keyboardOption.languageSet = params.languageList;
	ifKeyboard = new Keyboard(keyboardOption, params.userOptions);
	$('html').on('focus', selector, f_focus);    
	$('html').on('focus', 'input:password',f_focusPassport);    
	$('html').on('blur', selector, f_blur);
	$('html').on('keydown', selector, f_keyDown);
	$('html').on('keyup', selector, f_keyUp);
	$(function() {
		if(document.activeElement != document.getElementsByTagName('body')[0]){
			// если при загрузки странницы установлен автофокус на текстовом поле
			if($(document.activeElement).is('input:password')){
				ifKeyboard.setField(document.activeElement, document);
				self.port.emit('setField', {animate: false});
				return;
			}
			if($(document.activeElement).is(nonSelector)){
				return false;
			}
			ifKeyboard.setField(document.activeElement, document);    
			self.port.emit('setField', {});
		}
	});
});	
self.port.on('destroy', function(){
	$('html').off('focus', selector, f_focus);    
	$('html').off('focus', 'input:password',f_focusPassport);    
	$('html').off('blur', selector, f_blur);
	$('html').off('keydown', selector, f_keyDown);
	$('html').off('keyup', selector, f_keyUp);
  delete ifKeyboard;
});	

self.port.on('changeSymbols', function(params){
	if(ifKeyboard.active){
		ifKeyboard.setKStutus(params);
	}
});
self.port.on('functional', function(params){
	switch(func){
		case "keyBackspace":
			ifKeyboard.field.backspacing();
			break;
		case "keyDelete": 
			ifKeyboard.field.deleting();
			break;    
		case "keyEnter": 
			ifKeyboard.field.simpleEnter();
			break;   
		case "keyShiftEnter": 
			ifKeyboard.field.shiftEnter();
			break;
	}
})
self.port.on('addLetter', function(massage){
	setTimeout(function(){
		ifKeyboard.field.addSymbol(massage[0]);
	},12);
});

var selector = 'textarea, input, [contentEditable]';
var nonSelector = ':password, :button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';

var f_focus = function(e){
	if($(this).is(nonSelector))
		return false;
	ifKeyboard.setField(this, document);
	self.port.emit('setField', {});
}
var f_focusPassport = function(e){
	ifKeyboard.setField(this, document);
	self.port.emit('setField', {animate: false});
}
var f_blur = function(e){
	ifKeyboard.fieldBlur();
	self.port.emit('blurField');

}
var f_keyDown =  function(e){
	ifKeyboard.keyDown(e);
	self.port.emit('keyDown', getKeyParams(e));
}
var f_keyUp = function(e){
	ifKeyboard.keyUp(e);
	self.port.emit('keyUp', getKeyParams(e));
}