var Keyboard = function(options, userOptions){
	this.logic = new KeyboardLogic(this, options);
	this.keyCodes = options.keyCodes;
	this.turnOn = true;
	this.active = true;
	
	this.visualOption = userOptions.show;

/*****  create keys logic  *****/
	this.keyLetters = [];
	this.keyFunctionals = [];
	var keyWordCount = 0;
	var keyFunctionalCount = 0;
		var languageCount =  options.languageSet.length;

	//keyboardOption.keySet по строкам 
	for (var i1 = 0; i1 < options.keySet.length; i1++) {
		//keyboardOption.keySet по элементам
		for (var i2 = 0; i2 < options.keySet[i1].length; i2++) {
			if(options.keySet[i1][i2] == 'layout'){
				// по колличеству элементов в первой расскладке
				for (var i3 = 0; i3 < options.languageSet[0].letterSet[i1].length; i3++) {
					var symbols = [];
						// по колличеству расскладок
						for (var i4 = 0; i4 < languageCount; i4++) {
							var keySymbols = options.languageSet[i4].letterSet[i1][i3];
							symbols[i4] = {
								lowerCase: keySymbols[1],
								upperCase: keySymbols[2],
								lowerAdd: keySymbols[3],
								upperAdd: keySymbols[4],
								options: keySymbols[0]
							};
						}
						this.keyLetters[keyWordCount] = new KeyLetter(this, this.keyCodes[keyWordCount], symbols, {});
						keyWordCount++;						
				}
			}else{
				this.keyFunctionals[keyFunctionalCount] = new KeyFunctional(this, options.keySet[i1][i2]);
				keyFunctionalCount++;
			}				
		}
	}
	if(this.visualOption != 'newer')
		this.visual = new KeyboardVisual(this, options, userOptions);
	this.browserFocused = true;
} 


Keyboard.prototype.setField = function(params){
	this.active = true;
	params = $.extend({
		animate: true
	}, params);
	this.animate = params.animate;
	if(this.visualOption == 'on-active')
		this.visual.show();
};

Keyboard.prototype.destroy = function(){
	if(this.visualOption != 'newer')
		this.visual.container.remove();
}

Keyboard.prototype.fieldBlur = function(){
	if(this.visualOption == 'on-active')
		this.visual.hide();
};

Keyboard.prototype.browserFocus = function(){
	this.browserFocused = true;
}

Keyboard.prototype.browserBlur = function(){
	this.browserFocused = false;
	var that = this;
	setTimeout(function(){
		if(that.browserFocused)
			return;
		if(that.logic.kStatus.shift.physical){
			that.logic.keyShift({from: "physical", status: "up"});
			that.visualKeyFunct('keyShift', false);	
			that.sendKStutus();
		}
		if(that.logic.kStatus.addit.physical){
			that.logic.keyAddit({from: "physical", status: "up"});
			that.visualKeyFunct('keyAddit', false);
			that.sendKStutus();
		}  		
	}, 12);
}

Keyboard.prototype.addLetter = function(keyLetter){
	if(!this.active)
		return;
	this.logic.addLetter(keyLetter.currentSymbol);
	if(this.animate && (this.visualOption != 'newer'))
		keyLetter.visual.down();
	if(this.logic.additObserve()){
		this.sendKStutus();
		this.visualKeyFunct('keyAddit', false);	
	}
	if(this.logic.shiftObserve()){
		this.sendKStutus();
		this.visualKeyFunct('keyShift', false);	
	}
}

Keyboard.prototype.keyFunctionalAction = function(func, params){
	switch(func){
		case "keyAddit":
			this.logic.keyAddit(params);
			this.sendKStutus();
			this.visualKeyFunct('keyAddit', this.logic.kStatus.addit.active);	
			break;
		case "keyAdditLong":
			this.logic.keyAdditLong(params);
			this.sendKStutus();
			this.visualKeyFunct('keyAdditLong', this.logic.kStatus.additLong.active);	
			break;
		case "keyBackspace":
			this.logic.keyBackspace();
			break;
		case "keyCaps": 
			this.logic.keyCaps();
			this.sendKStutus();
			this.visualKeyFunct('keyCaps', this.logic.kStatus.caps.active);	
			break;
		case "keyDelete": 
			this.logic.keyDelete();
			break;    
		case "keyEnter": 
			this.logic.keyEnter();
			break;   
		case "keyShiftEnter": 
			this.logic.keyShiftEnter();
			break;   
		case "keyNextLanguage":
			this.logic.keyNextLanguage();
			this.sendKStutus();
			this.visualKeyFunct('keyNextLanguage', true);
			var that = this;
			setTimeout(function(){
				that.visualKeyFunct('keyNextLanguage', false);
			}, 250); 
			break;
		case "keySpace": 
			this.logic.keySpace();
			break;
		case "keyShift": 
			this.logic.keyShift(params);
			this.sendKStutus();
			this.visualKeyFunct('keyShift', this.logic.kStatus.shift.active);	
			break;
	}
}


Keyboard.prototype.setKStutus = function(newStatus){
	this.logic.kStatus = newStatus;
	var value = {
		shift: this.logic.kStatus.shift.active,
		caps: this.logic.kStatus.caps.active,
		addit:  (this.logic.kStatus.addit.active ^ this.logic.kStatus.additLong.active),
		language: this.logic.kStatus.language.value
	};
	for(var i = this.keyLetters.length-1; i > -1; i--){
		this.keyLetters[i].changeSymbols(value);
	}
	if(this.visualOption != 'newer'){
		this.visual.setLanguageTitles(this.logic.kStatus.language.value);
		this.visualKeyFunct('keyShift', this.logic.kStatus.shift.active);
		this.visualKeyFunct('keyCaps', this.logic.kStatus.caps.active);
		this.visualKeyFunct('keyAddit', this.logic.kStatus.addit.active);
		this.visualKeyFunct('keyAdditLong', this.logic.kStatus.additLong.active);
	}	
}

Keyboard.prototype.sendKStutus = function(){
	self.port.emit('changeSymbols', this.logic.kStatus);
}
	
Keyboard.prototype.visualKeyFunct = function(func, bool){
	if(this.visualOption == 'newer')
		return;
	if(bool){
		for(var i = this.keyFunctionals.length-1; i > -1 ; i--){
			if( this.keyFunctionals[i].func == func){
				this.keyFunctionals[i].visual.down();
			};
		}
	}else{
		for(var i = this.keyFunctionals.length-1; i > -1 ; i--){
			if( this.keyFunctionals[i].func == func){
				this.keyFunctionals[i].visual.up();
			};
		}
	}
}

Keyboard.prototype.codeToKeyDown = function(code){
	if(this.logic.additObserve()){
		this.sendKStutus();
		this.visualKeyFunct('keyAddit', false);	
	}
	if(this.logic.shiftObserve()){
		this.sendKStutus();
		this.visualKeyFunct('keyShift', false);	
	}
	if(this.visualOption == 'newer')
		return;
	for(var i = this.keyCodes.length-1; i > -1 ; i--)
		if( this.keyCodes[i] == code ){
			this.keyLetters[i].visual.down();
				return;
	}
	for(var i = this.keyFunctionals.length-1; i > -1 ; i--)
	if( this.keyFunctionals[i].code == code ){
		this.keyFunctionals[i].visual.down();
		return;
	}
}
	
Keyboard.prototype.codeToKeyUp = function(code){
	if(this.visualOption == 'newer')
		return;
	for(var i = this.keyCodes.length-1; i > -1 ; i--)
		if( this.keyCodes[i] == code ){
			this.keyLetters[i].visual.up();
			return;
		}
	for(var i = this.keyFunctionals.length-1; i > -1 ; i--)
		if( this.keyFunctionals[i].code == code ){
			this.keyFunctionals[i].visual.up();
			return;
		}
}