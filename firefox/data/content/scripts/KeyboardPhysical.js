KeyboardPhysical = function(kb){
	this.kb = kb;
}

KeyboardPhysical.prototype.keyDown = function(event){
	if(!this.kb.isToCapturePhysicalKeyPress)
		return;

	this.code = event.originalEvent.code;
	this.event = event;

	if(this.hotKeysDown()){
		this.stopEvent();
		return;
	}

	if((!this.isEventInKeysRange()) || (!this.kb.field.active))
		return;

	for(var i = this.kb.keyFunctionals.length-1; i > -1 ; i--){
		if( this.kb.keyFunctionals[i].code == this.code ){
			self.port.emit('KeyDown', this.code);
		};
	}

	if(this.keyLettersDown())
		this.stopEvent();
}

KeyboardPhysical.prototype.keyUp = function(event){
	if(!this.kb.isToCapturePhysicalKeyPress)
		return;
	this.code = event.originalEvent.code;
	this.event = event;

	this.hotKeysUp();

	for(var i = this.kb.keyFunctionals.length-1; i > -1 ; i--){
		if( this.kb.keyFunctionals[i].code == this.code ){
			self.port.emit('KeyUp', this.code);
		};
	}

	this.keyLettersUp();
}


KeyboardPhysical.prototype.stopEvent = function(){
	this.event.preventDefault();
	this.event.stopPropagation();
}

KeyboardPhysical.prototype.hotKeysDown = function(){
	for(var i = this.kb.hotKeys.length-1; i > -1 ; i--)
		if(this.isHotKeyInKeysCombinationDown(this.kb.hotKeys[i])){
			this.hotKeyDown(this.kb.hotKeys[i]);
			return true;
		}
}

KeyboardPhysical.prototype.hotKeyDown = function(hotKey){
	if(!hotKey.wasPressed){
		if(hotKey.when === 'down')
			hotKey.active = !hotKey.active;
		else
			hotKey.active = true;
		hotKey.action("down");
		return true;
	}
}

KeyboardPhysical.prototype.hotKeysUp = function(){
	for(var i = this.kb.hotKeys.length-1; i > -1 ; i--)
		this.hotKeyUp(this.kb.hotKeys[i])
}

KeyboardPhysical.prototype.hotKeyUp = function(hotKey){
	if((hotKey.when === 'down') && this.isHotKeyInKeysCombinationUpNoAction(hotKey))
			hotKey.active = false;

	if(this.isHotKeyInKeysCombinationUp(hotKey)){
		hotKey.action("up");
		hotKey.active = false;
	}
	hotKey.wasPressed = false;
}

KeyboardPhysical.prototype.keyLettersDown = function(){
	for(var i = this.kb.keyLetters.length-1; i > -1 ; i--)
		if(this.kb.keyLetters[i].code === this.code){
			this.kb.keyLetters[i].action();
			self.port.emit('KeyDown', this.code);
			return true;
		};
	return false;
}
KeyboardPhysical.prototype.keyLettersUp = function(){
	for(var i = this.kb.keyLetters.length-1; i > -1 ; i--)
		if(this.kb.keyLetters[i].code === this.code){
			self.port.emit('KeyUp', this.code);
			return true;
		};
	return false;
}





KeyboardPhysical.prototype.isHotKeyInKeysCombinationDown = function(hotKey){
	if(
		(this.code === hotKey.code) ||
		((hotKey.when === "while") && this.isCodeModifier())
	){
		var ans = true;
		if (hotKey.alt)
			ans = ans && (this.event.altKey || (this.code.indexOf("Alt") !== -1));
		if (hotKey.ctrl)
			ans = ans && (this.event.ctrlKey || (this.code.indexOf("Ctrl") !== -1));
		if (hotKey.shift)
			ans = ans && (this.event.shiftKey || (this.code.indexOf("Shift") !== -1));
		if (hotKey.meta)
			ans = ans && (this.event.metaKey || (this.code.indexOf("OS") !== -1));
		return ans;
	}else return false;
}

KeyboardPhysical.prototype.isHotKeyInKeysCombinationUp = function(hotKey){
	if(!hotKey.active)
		return false;
	if(
		(this.code === hotKey.code) ||
		((hotKey.when === "while") && this.isCodeModifier())
	){
		var ans = false;
		if (hotKey.alt)
			ans = ans ||(this.code.indexOf("Alt") !== -1);
		if (hotKey.ctrl)
			ans = ans || (this.code.indexOf("Ctrl") !== -1);
		if (hotKey.shift)
			ans = ans || (this.code.indexOf("Shift") !== -1);
		if (hotKey.meta)
			ans = ans || (this.code.indexOf("OS") !== -1);
		return ans;
	}else return false;
}

KeyboardPhysical.prototype.isHotKeyInKeysCombinationUpNoAction = function(hotKey){
	if((this.code === hotKey.code) || this.isCodeModifier()){
		var ans = false;
		if (hotKey.alt)
			ans = ans ||(this.code.indexOf("Alt") !== -1);
		if (hotKey.ctrl)
			ans = ans || (this.code.indexOf("Ctrl") !== -1);
		if (hotKey.shift)
			ans = ans || (this.code.indexOf("Shift") !== -1);
		if (hotKey.meta)
			ans = ans || (this.code.indexOf("OS") !== -1);
		return ans;
	}else return false;
}

KeyboardPhysical.prototype.isCodeModifier = function(){
	var ans = (
							(this.code.indexOf("Shift") !== -1)
							|| (this.code.indexOf("Alt") !== -1)
							|| (this.code.indexOf("Ctrl") !== -1)
							|| this.code.indexOf("OS") !== -1
	);
	return ans;
}

KeyboardPhysical.prototype.isEventInKeysRange = function(){
	// Shift + A : true — print upper A by extension
	// Ctrl + A: false — select all by OS
	var ctrl = false;
	var shift = false;
	var alt = false;
	var meta = false;
	for(var i = this.kb.hotKeys.length-1; i > -1 ; i--){
		if(this.kb.hotKeys[i].active){
			alt = alt || this.kb.hotKeys[i].alt;
			ctrl = ctrl || this.kb.hotKeys[i].ctrl;
			shift = shift || this.kb.hotKeys[i].shift;
			meta = meta || this.kb.hotKeys[i].meta;
		}
	}
	if(this.event.ctrlKey && !ctrl)
		return false;
	if(this.event.altKey && !alt)
		return false;
	if(this.event.shiftKey && !shift)
		return false;
	if(this.event.metaKey && !meta)
		return false;

	return true;
}
