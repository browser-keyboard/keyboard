$(function(){
	ifKeyboard = new Keyboard(keyboardOption);
	var takeKeyParams = function(e){
		var params = {};
		params.keyCode = e.keyCode;
		params.shitfKey = e.shiftKey;
		params.ctrlKey = e.ctrlKey;
		params.altKey = e.ctrlKey;
		return params;
	}
	self.port.on('changeSymbols', function(params){
		if(ifKeyboard.active){
			
			ifKeyboard.changeSymbolicks();
		}
	});
	self.port.on('changeLanguage', function(params){
		if(ifKeyboard.active)
			ifKeyboard.changeLanguage(params);
	});
	/*
	self.port.on('simpleEnter', function(){
		ifKeyboard.field.simpleEnter();
	});
	self.port.on('shiftEnter', function(){
		ifKeyboard.field.shiftEnter();
	});
	self.port.on('deleting', function(){
		ifKeyboard.field.deleting();
	});
	self.port.on('backspacing', function(){
		ifKeyboard.field.backspacing();
	});*/
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
	self.port.on('activision', function(params){
		ifKeyboard.turnOn = params;
	});
	self.port.on('addLetter', function(massage){
		if(ifKeyboard.active)
			setTimeout(function(){ifKeyboard.field.addSymbol(massage[0]);},12);
	});
	
	var selector = 'textarea, input, [contentEditable]';
  var nonSelector = ':password, :button, :checkbox, :file, :hidden, :image, :radio, :reset, :submit';


  $('html').on('focus', selector, function(e){
  	if($(this).is(nonSelector))
  		return false;
   	ifKeyboard.setField(this, document);
		self.port.emit('setField', {});
   });
  
	$('html').on('focus', 'input:password', function(e){
		ifKeyboard.setField(this, document);
		self.port.emit('setField', {animate: false});
	 });
	
	$('html').on('blur', selector, function(){
		ifKeyboard.fieldBlur();
  	self.port.emit('blurField');
	});

	$('html').on('keydown', "body", function(e){
		if(!ifKeyboard.turnOn)
			return;
		ifKeyboard.keyDown(e);
		var params = takeKeyParams(e);
		self.port.emit('keyDown', params);
	});
	$('html').on('keyup', "body", function(e){
		if(!ifKeyboard.turnOn)
			return;
		ifKeyboard.keyUp(e);
		var params = takeKeyParams(e);
		self.port.emit('keyUp', params);
	});
});

