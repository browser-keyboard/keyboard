var getKeyParams = function(e){
	var params = {};
	params.keyCode = e.originalEvent.code;
	params.shitfKey = e.shiftKey;
	params.ctrlKey = e.ctrlKey;
	params.altKey = e.ctrlKey;
	return params;
}

var contentKeyboard;
self.port.on('create', function(params){
	keyboardOption.languageSet = params.languageList;
	contentKeyboard = new Keyboard(keyboardOption, params.userOptions);
	$('html').on('focus', selector, f_focus);
	$('html').on('focus', 'input:password',f_focusPassport);
	$('html').on('blur', selector, f_blur);
	$('html').on('keydown', selector, f_keyDown);
	$('html').on('keyup', selector, f_keyUp);
	$(setFocusIfIsAutofocusField);
});
self.port.on('destroy', function(){
	$('html').off('focus', selector, f_focus);
	$('html').off('focus', 'input:password',f_focusPassport);
	$('html').off('blur', selector, f_blur);
	$('html').off('keydown', selector, f_keyDown);
	$('html').off('keyup', selector, f_keyUp);
  delete contentKeyboard;
});

self.port.on('changeSymbols', function(params){
	if(contentKeyboard.isActive()){
		contentKeyboard.setKStutus(params);
	}
});
self.port.on('functional', function(params){
	switch(params){
		case "keyBackspace":
			contentKeyboard.field.backspacing();
			break;
		case "keyDelete":
			contentKeyboard.field.deleting();
			break;
		case "keyEnter":
			contentKeyboard.field.keyEnter();
			break;
	}
})
self.port.on('addLetter', function(massage){
	setTimeout(function(){
		contentKeyboard.field.addSymbol(massage[0]);
	},12);
});

var selector = 'textarea, input, [contentEditable]';
var nonSelector = ':password, :button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';

var f_focus = function(e){
	if($(this).is(nonSelector))
		return false;
	contentKeyboard.setField(this, document);
	self.port.emit('setField', {});
}
var f_focusPassport = function(e){
	contentKeyboard.setField(this, document);
	self.port.emit('setField', {animate: false});
}
var f_blur = function(e){
	contentKeyboard.fieldBlur();
	self.port.emit('blurField');

}
var f_keyDown =  function(e){
	contentKeyboard.keyDown(e);
	self.port.emit('keyDown', getKeyParams(e));
}
var f_keyUp = function(e){
	contentKeyboard.keyUp(e);
	self.port.emit('keyUp', getKeyParams(e));
}

var setFocusIfIsAutofocusField = function(){
	if(document.activeElement != document.getElementsByTagName('body')[0]){
		// если при загрузки странницы установлен автофокус на текстовом поле
		if($(document.activeElement).is('input:password')){
			contentKeyboard.setField(document.activeElement, document);
			self.port.emit('setField', {animate: false});
			setTimeout(function(){self.port.emit('setField', {animate: false});}, 600);
		}else if(!$(document.activeElement).is(nonSelector)){
			contentKeyboard.setField(document.activeElement, document);
			self.port.emit('setField', {});
			setTimeout(function(){self.port.emit('setField', {});}, 600);
		}
	}
}
