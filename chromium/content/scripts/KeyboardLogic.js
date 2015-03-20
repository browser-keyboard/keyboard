var KeyboardLogic;

$(function(){
	KeyboardLogic = function(kb, field, options){
		this.kb = kb;
		this.field = field;

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
  	this.field.addSymbol(letter);
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
  	this.field.backspacing();
  } 
  
  KeyboardLogic.prototype.keyCaps = function(){
  	this.kStatus.caps.active = !this.kStatus.caps.active;
  }

  
  KeyboardLogic.prototype.keyDelete = function(){
  	this.field.deleting();
  }

  KeyboardLogic.prototype.keyEnter = function(){
  	this.field.simpleEnter();
  }
  
  KeyboardLogic.prototype.keyShiftEnter = function(){
  	this.field.shiftEnter();
  }
  
  KeyboardLogic.prototype.keyNextLanguage = function(){
  	if((this.kStatus.language.value + 1) == this.kStatus.language.count ){
  		this.kStatus.language.value = 0;
  	}else{
  		this.kStatus.language.value++;
  	}
  }
  
  KeyboardLogic.prototype.keySpace = function(){
  	this.field.addSymbol(' ');
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

	
});
