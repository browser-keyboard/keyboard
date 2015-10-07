var Keyboard = function(options, userOptions){
	this.isToCapturePhysicalKeyPress = userOptions.capture;
	this.createButtons(options);
	this.createhotKeys(options);

	this.field = new Field();
	this.logic = new KeyboardLogic(this, this.field, options);
	this.physical = new KeyboardPhysical(this);
	this.browserFocused = true;
}

Keyboard.prototype.createButtons = function(options){
	this.keyLetters = [];
	this.keyFunctionals = [];
	var languageCount =  options.languageSet.length;
	var keyWordCount = 0;

	for (var i1 = 0; i1 < options.keySet.length; i1++)
		for (var i2 = 0; i2 < options.keySet[i1].length; i2++)
			if(options.keySet[i1][i2] == 'layout'){
				// по колличеству элементов в первой расскладке
				for (var i3 = 0; i3 < options.languageSet[0].letterSet[i1].length; i3++) {
					var symbols = [];

					for (var i4 = 0; i4 < languageCount; i4++) {
						var keySymbols = options.languageSet[i4].letterSet[i1][i3];
						symbols.push({
							lowerCase: keySymbols[1],
							upperCase: keySymbols[2],
							lowerAdd: keySymbols[3],
							upperAdd: keySymbols[4],
							options: keySymbols[0]
						});
					}
					this.keyLetters.push(new KeyLetter(this, options.keyCodes[keyWordCount], symbols));
					keyWordCount++;
				}

			}else{
				this.keyFunctionals.push(new KeyFunctional(this, options.keySet[i1][i2]));
			}
}

Keyboard.prototype.createhotKeys = function(options){
	this.hotKeys = [];
	for (var i = 0; i < options.combos.length; i++)
		this.hotKeys[i] = new HotKey(this, options.combos[i]);
}

Keyboard.prototype.isActive = function(){
	return this.field.active;
}

Keyboard.prototype.keyFunctionalAction = function(func, params){
	switch(func){
		case "keyAddit":
			this.logic.keyAddit(params);
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
};


Keyboard.prototype.fieldBlur = function(){
	this.field.blur();
};

Keyboard.prototype.addLetter = function(keyLetter){
	if(!this.field.active)
		return;
	this.logic.addLetter(keyLetter.currentSymbol);
	if(this.logic.additObserve() || this.logic.shiftObserve())
		this.sendKStutus();
}

Keyboard.prototype.setKStutus = function(newStatus){
	this.logic.kStatus = newStatus;
	var value = {
		shift: this.logic.kStatus.shift.active,
		caps: this.logic.kStatus.caps.active,
		addit:  (this.logic.kStatus.addit.active),
		language: this.logic.kStatus.language.value
	};
	for(var i = this.keyLetters.length-1; i > -1; i--){
		this.keyLetters[i].changeSymbols(value);
	}
}

Keyboard.prototype.sendKStutus = function(){
	self.port.emit('changeSymbols', this.logic.kStatus);
}

Keyboard.prototype.keyDown = function(event){
	this.physical.keyDown(event);
};

Keyboard.prototype.keyUp = function(event){
	this.physical.keyUp(event);
}
