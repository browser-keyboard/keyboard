var Keyboard = function(options, userOptions){
	this.field = new Field();
	this.logic = new KeyboardLogic(this, this.field, options);
	this.keyCodes = options.keyCodes;
	
this.capture = userOptions.capture;

// create hotkey combinations
	this.hotKeys = [];
	for (var i = 0; i < options.combos.length; i++){
		this.hotKeys[i] = new HotKey(this, options.combos[i]);
	}
	
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
	this.browserFocused = true;
} 


Keyboard.prototype.keyFunctionalAction = function(func, params){
	switch(func){
		case "keyAddit":
			this.logic.keyAddit(params);
			this.sendKStutus();
			break;
		case "keyAdditLong":
			this.logic.keyAdditLong(params);
			this.sendKStutus();
			break;
		case "keyCaps": 
			this.logic.keyCaps();
			this.sendKStutus();
			break;   
		case "keyNextLanguage":
			this.logic.keyNextLanguage();
			this.sendKStutus();
			break;
		case "keyShift": 
			this.logic.keyShift(params);
			this.sendKStutus();
			break;
	}
}

Keyboard.prototype.setField = function(newField, newWindow, params){
	this.field.focus(newField, newWindow);
	this.active = true;
};


Keyboard.prototype.fieldBlur = function(){
	this.active = false;
	this.field.blur();
};

Keyboard.prototype.addLetter = function(keyLetter){
	if(!this.active)
		return;
	this.logic.addLetter(keyLetter.currentSymbol);
	if(this.logic.additObserve() || this.logic.shiftObserve()){
		this.sendKStutus();
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
}
Keyboard.prototype.sendKStutus = function(){
	self.port.emit('changeSymbols', this.logic.kStatus);
}

//*******Physical Key Actions******************************************************
Keyboard.prototype.keyDown = function(event){
	if(!this.capture)
		return;
	var code = event.keyCode;
	var isHappened = false;
	for(var i = this.hotKeys.length-1; i > -1 ; i--){
		if(this.checkKeyHot(event, this.hotKeys[i], code, "down")){
			if(!this.hotKeys[i].thisSesson){
				if(this.hotKeys[i].when == 'down')
					this.hotKeys[i].active = !this.hotKeys[i].active;
				else
					this.hotKeys[i].active = true;
				this.hotKeys[i].action("down");
				this.hotKeys[i].thisSesson = true;
			}
			isHappened =  true;
		}
	}
	if(isHappened){ 			
		event.preventDefault();  //prevent default DOM action
		event.stopPropagation();   //stop bubbling
		return;
	}
	
	if(!this.checkIsUsedSCANormal(event))
		return false;

	if(!this.active)
		return;
	
	for(var i = this.keyFunctionals.length-1; i > -1 ; i--){
		if( this.keyFunctionals[i].code == code ){
			self.port.emit('KeyDown', code);
		};
	}
	
	for(var i = this.keyCodes.length-1; i > -1 ; i--){    	
		if( this.keyCodes[i] == code ){
			this.keyLetters[i].action();
			self.port.emit('KeyDown', code);
			isHappened =  true;
		};
	}

	if(isHappened){ 			
		event.preventDefault();  //prevent default DOM action
		event.stopPropagation();   //stop bubbling
		return;
	}
	
};  

Keyboard.prototype.keyUp = function(event){
	if(!this.capture)
		return;
	var code = event.keyCode;
	var isHappened = false;
	for(var i = this.hotKeys.length-1; i > -1 ; i--){
		if(this.checkKeyHot(event, this.hotKeys[i], code, "upNoAction")){
			if(this.hotKeys[i].when == 'down'){
				this.hotKeys[i].active = false;
			}
		}
		if(this.checkKeyHot(event, this.hotKeys[i], code, "up")){
				this.hotKeys[i].action("up");
				this.hotKeys[i].active = false;
				isHappened =  true;
		}
		this.hotKeys[i].thisSesson = false;			
	}
	
	for(var i = this.keyFunctionals.length-1; i > -1 ; i--){
		if( this.keyFunctionals[i].code == code ){
			self.port.emit('KeyUp', code);
		};
	}
			
	for(var i = this.keyCodes.length-1; i > -1 ; i--){
		if( this.keyCodes[i] == code ){
			self.port.emit('KeyUp', code);
			isHappened =  true;
		};
	}
	
/*	if(isHappened){ 	
		event.preventDefault();  //prevent default DOM action
//    event.stopPropagation();   //stop bubbling
	}*/
}

Keyboard.prototype.checkKeyHot = function(event, keyHot, code, downOrUp){
	var ans = false;
	switch (downOrUp) {
	case "down":
		if(
				(code == keyHot.code) ||
				((keyHot.code == 0)
				&& ((code==16) || (code==17) || (code==18)))
			)
			{
				var ans = true;
				if (keyHot.alt){
					ans = ans && (event.altKey || (code==18));
				}
				if (keyHot.ctrl){
					ans = ans && (event.ctrlKey || (code==17));
				}
				if (keyHot.shift){
					ans = ans && (event.shiftKey || (code==16));
				}
				
			}
		break;
	case "up":
		if(!keyHot.active)
			return false;
		if(
				(code == keyHot.code) ||
				((keyHot.code == 0)
				&& ((code==16) || (code==17) || (code==18)))
			)
			{
				var ans = false;
				if (keyHot.alt){
					ans = ans ||(code==18);
				}
				if (keyHot.ctrl){
					ans = ans || (code==17);
				}
				if (keyHot.shift){
					ans = ans || (code==16);
				}
			}
	case "upNoAction":
		if(
			(code == keyHot.code) || (code==16) || (code==17) || (code==18)
		)
		{
			var ans = false;
			if (keyHot.alt){
				ans = ans ||(code==18);
			}
			if (keyHot.ctrl){
				ans = ans || (code==17);
			}
			if (keyHot.shift){
				ans = ans || (code==16);
			}
		}
		break;
	}
	return ans;
};

Keyboard.prototype.checkIsUsedSCANormal = function(event){
	var ctrl = false;
	var shift = false;
	var alt = false;
	for(var i = this.hotKeys.length-1; i > -1 ; i--){
		if(this.hotKeys[i].active){
			if (this.hotKeys[i].alt){
				alt = true;
			}
			if (this.hotKeys[i].ctrl){
				ctrl = true;
			}
			if (this.hotKeys[i].shift){
				shift = true;
			}
		}
	}
	if(event.ctrlKey && !ctrl)
		return false;
	if(event.altKey && !alt)
		return false;
	if(event.shiftKey && !shift)
		return false;

	return true;
}
