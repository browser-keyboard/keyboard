var Keyboard = function(options, userOptions){
	this.logic = new KeyboardLogic(this, options);
	this.keyCodes = options.keyCodes;
	this.active = true;

	this.createButtons(options);

	this.visual = new KeyboardVisual(this, options, userOptions);
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

Keyboard.prototype.setField = function(params){
	this.active = true;
	params = $.extend({
		animate: true
	}, params);
	this.animate = params.animate;
	if(this.visual.toShowOption == 'on-active')
		this.visual.show();
};

Keyboard.prototype.destroy = function(){
	this.visual.destroy();
}

Keyboard.prototype.fieldBlur = function(){
	if(this.visual.toShowOption == 'on-active')
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
			that.visual.keyFunctPress('keyShift', false);
			that.sendKStutus();
		}
		if(that.logic.kStatus.addit.physical){
			that.logic.keyAddit({from: "physical", status: "up"});
			that.visual.keyFunctPress('keyAddit', false);
			that.sendKStutus();
		}
	}, 12);
}

Keyboard.prototype.addLetter = function(keyLetter){
	if(!this.active)
		return;
	this.logic.addLetter(keyLetter.currentSymbol);
	if(this.animate && (this.toShowOption != 'newer'))
		keyLetter.visual.down();
	if(this.logic.additObserve()){
		this.sendKStutus();
		this.visual.keyFunctPress('keyAddit', false);
	}
	if(this.logic.shiftObserve()){
		this.sendKStutus();
		this.visual.keyFunctPress('keyShift', false);
	}
}

Keyboard.prototype.keyFunctionalAction = function(func, params){
	switch(func){
		case "keyAddit":
			this.logic.keyAddit(params);
			this.sendKStutus();
			this.visual.keyFunctPress('keyAddit', this.logic.kStatus.addit.active);
			break;
		case "keyBackspace":
			this.logic.keyBackspace();
			break;
		case "keyCaps":
			this.logic.keyCaps();
			this.sendKStutus();
			this.visual.keyFunctPress('keyCaps', this.logic.kStatus.caps.active);
			break;
		case "keyDelete":
			this.logic.keyDelete();
			break;
		case "keyEnter":
			this.logic.keyEnter();
			break;
		case "keyNextLanguage":
			this.logic.keyNextLanguage();
			this.sendKStutus();
			this.visual.keyFunctPress('keyNextLanguage', true);
			var that = this;
			setTimeout(function(){
				that.visual.keyFunctPress('keyNextLanguage', false);
			}, 250);
			break;
		case "keySpace":
			this.logic.keySpace();
			break;
		case "keyShift":
			this.logic.keyShift(params);
			this.sendKStutus();
			this.visual.keyFunctPress('keyShift', this.logic.kStatus.shift.active);
			break;
	}
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
	if(this.toShowOption != 'newer'){
		this.visual.setLanguageTitles(this.logic.kStatus.language.value);
		this.visual.keyFunctSyncByKStatus(this.logic.kStatus);
	}
}

Keyboard.prototype.sendKStutus = function(){
	self.port.emit('changeSymbols', this.logic.kStatus);
}

Keyboard.prototype.keyDown = function(code){
	this.visual.keyDown(code);
}

Keyboard.prototype.keyUp = function(code){
	this.visual.keyUp(code);
}
