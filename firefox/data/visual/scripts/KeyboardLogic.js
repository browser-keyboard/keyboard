var KeyboardLogic = function(kb, options){
	this.kb = kb;

	// keys
	this.kStatus = {
		shift:{
			physical: false,
			active: false
		},
		caps: {
			active: false
		},
		addit: {
			physical: false,
			active: false    		
		},
		additLong: {
			active: false
		},
		language: {
			value: 0,
			count: options.languageSet.length
		}   		
	}
	
}

KeyboardLogic.prototype.addLetter = function(letter){
	self.port.emit('addLetter', [letter]);
}

KeyboardLogic.prototype.keyAddit = function(param){
	var status = this.kStatus.addit;
	switch (param.from) {
	case "virtual":
		if(status.active){
			status.active = false;
			status.physical = false;
		}else{
			status.active = true;
		}
		break;
	case "physical":
		switch (param.status) {
		case "down":
			status.active = true;
			status.physical = true;
			break;
		case "up":
			status.active = false;
			status.physical = false;		
			break;
		}
	};
	this.kStatus.addit = status;
}

KeyboardLogic.prototype.keyAdditLong = function(){
	this.kStatus.additLong.active = !this.kStatus.additLong.active;
}

KeyboardLogic.prototype.keyBackspace = function(){
	self.port.emit('functional', 'backspacing');
} 

KeyboardLogic.prototype.keyCaps = function(){
	this.kStatus.caps.active = !this.kStatus.caps.active;
}


KeyboardLogic.prototype.keyDelete = function(){
	self.port.emit('functional', 'deleting');
}

KeyboardLogic.prototype.keyEnter = function(){
	self.port.emit('functional', 'simpleEnter');
}

KeyboardLogic.prototype.keyShiftEnter = function(){
	self.port.emit('functional', 'shiftEnter');
}

KeyboardLogic.prototype.keyNextLanguage = function(){
	if((this.kStatus.language.value + 1) == this.kStatus.language.count ){
		this.kStatus.language.value = 0;
	}else{
		this.kStatus.language.value++;
	}
	self.port.emit('changeLanguage', this.kStatus.language.value);
}

KeyboardLogic.prototype.keySpace = function(){
	self.port.emit('addLetter', [' ']);
}

KeyboardLogic.prototype.keyShift = function(param){
	var status = this.kStatus.shift;
	switch (param.from) {
	case "virtual":
		if(status.active){
			status.active = false;
			status.physical = false;
		}else{
			status.active = true;
		}
		break;
	case "physical":
		switch (param.status) {
		case "down":
			status.active = true;
			status.physical = true;
			break;
		case "up":
			status.active = false;
			status.physical = false;				
			break;
		}
	};
}

KeyboardLogic.prototype.additObserve = function(){
	if(this.kStatus.addit.active && !this.kStatus.addit.physical){
		this.kStatus.addit.active = false;
		return true;
	}  	
	return false;
}

KeyboardLogic.prototype.shiftObserve = function(){
	if(this.kStatus.shift.active && !this.kStatus.shift.physical){
		this.kStatus.shift.active = false;
		return true;
	}  	
	return false;
}