		for(var i = this.keyHots.length-1; i > -1 ; i--){
			if(this.checkKeyHot(event, this.keyHots[i], code, "down")){
					var func = this.keyHots[i].keyFunction;
					for(var i2 = this.keyFunctionals.length-1; i2 > -1 ; i2--){
			  		if( this.keyFunctionals[i2].func == func ){
			  			this.keyFunctionals[i2].keyUp();
			  		};
			  	}	
					isHappened =  true;
			}
		}
		

		var func = this.keyHots[i].keyFunction;
		for(var i2 = this.keyFunctionals.length-1; i2 > -1 ; i2--){
  		if( this.keyFunctionals[i2].func == func ){
  			this.keyFunctionals[i2].keyUp();
  		};
  	}	
		
		
		
		
		
		/*
		*/

	  Keyboard.prototype.keyBackspace = function(){
	    if (!this.field)
	      return;
	  	
	  	if($(this.field).is('textarea, input')){
	  		var selectStart = this.field.selectionStart;
	      var selectEnd = this.field.selectionEnd;
	      var textBegin = this.field.value.substring(0,selectStart);
	      var textEnd = this.field.value.substring(selectEnd,this.field.value.length);
	      if(selectStart == selectEnd){
	      	this.field.value = textBegin.substring(0,textBegin.length-1) + textEnd;
	    		this.field.setSelectionRange(selectStart-1,selectStart-1);
	      }else{
	      	this.field.value = textBegin+textEnd;
	      	this.field.setSelectionRange(selectStart,selectStart);
	      }
	    }else{
	    	var sel, range;
	      if (this.window.getSelection) {
	        sel = this.window.getSelection();
	        if (sel.rangeCount) {
	          range = sel.getRangeAt(0);

	          var selectStart = range.startOffset;
	          var selectEnd = range.endOffset;

	          var text = $(this.field).text();
	          var textBegin = text.substring(0,selectStart);
	          var textEnd = text.substring(selectEnd, text.length);
	          range = this.window.document.createRange();
	          
	          if(selectStart == selectEnd){
	          	text = textBegin.substring(0,textBegin.length-1) + textEnd;
	            $(this.field).text(text);
	        		
	            range.setStart(this.field.firstChild, selectStart-1);
	            range.setEnd(this.field.firstChild, selectStart-1);
	          }else{
	            text = textBegin + textEnd;
	            $(this.field).text(text);
	            range.setStart(this.field.firstChild, selectStart);
	            range.setEnd(this.field.firstChild, selectStart);
	          }
	          sel.removeAllRanges();
	          sel.addRange(range);
	        }
	      } else if (this.window.document.selection && this.window.document.selection.createRange) {
	        range = this.window.document.selection.createRange();
	        range.text = "";
	      }
	    }
	  	
	  }
	  
	  
	  Keyboard.prototype.keyDelete = function(){
	    if (!this.field)
	      return;
	  	if($(this.field).is('textarea, input')){
	  		var selectStart = this.field.selectionStart;
	      var selectEnd = this.field.selectionEnd;
	      var textBegin = this.field.value.substring(0,selectStart);
	      var textEnd = this.field.value.substring(selectEnd,this.field.value.length);
	      
	      if(selectStart == selectEnd){
	      	this.field.value = textBegin + textEnd.substring(1,textBegin.length);
	    		this.field.setSelectionRange(selectStart,selectStart);
	      }else{
	      	this.field.value = textBegin + textEnd;
	      	this.field.setSelectionRange(selectStart,selectStart);
	      }
	    }else{
	    	var sel, range;
	      if (this.window.getSelection) {
	        sel = this.window.getSelection();
	        if (sel.rangeCount) {
	          range = sel.getRangeAt(0);

	          var selectStart = range.startOffset;
	          var selectEnd = range.endOffset;

	          var text = $(this.field).html();
	          var textBegin = text.substring(0,selectStart);
	          var textEnd = text.substring(selectEnd, text.length);

	          console.log(textBegin);
	          console.log(textEnd);
	          
	          if(selectStart == selectEnd){
	          	text = textBegin + textEnd.substring(1,textBegin.length)
	            $(this.field).html(text);
	          }else{
	            text = textBegin + textEnd;
	            $(this.field).html(text);
	          }
	          console.log(text);
	          range = this.window.document.createRange();
	          range.setStart(this.field.firstChild, selectStart);
	          range.setEnd(this.field.firstChild, selectStart);
	          sel.removeAllRanges();
	          sel.addRange(range);
	        }
	      } else if (this.window.document.selection && this.window.document.selection.createRange) {
	        range = this.window.document.selection.createRange();
	        range.text = "";
	      }
	    }
	  	
	  }
		
		/*
		*/
	  

	  Keyboard.prototype.keyBackspace = function(){
	    if (!this.field)
	      return;
	  	
	  	if($(this.field).is('textarea, input')){
	  		var selectStart = this.field.selectionStart;
	      var selectEnd = this.field.selectionEnd;
	      var textBegin = this.field.value.substring(0,selectStart);
	      var textEnd = this.field.value.substring(selectEnd,this.field.value.length);
	      if(selectStart == selectEnd){
	      	this.field.value = textBegin.substring(0,textBegin.length-1) + textEnd;
	    		this.field.setSelectionRange(selectStart-1,selectStart-1);
	      }else{
	      	this.field.value = textBegin+textEnd;
	      	this.field.setSelectionRange(selectStart,selectStart);
	      }
	    }else{
	    	this.window.document.execCommand("delete");
	/*    	var sel, range;
	      if (this.window.getSelection) {
	      	sel = this.window.getSelection();
	        if (sel.rangeCount) {
	          range = sel.getRangeAt(0);

	          var selectStart = range.startOffset;
	          var selectEnd = range.endOffset;

	          
	          if(selectStart == selectEnd){
	        		if(selectStart == 0){
//	        			console.log(range);
//	      				console.log(range.commonAncestorContainer.parentNode.previousElementSibling);
	        			if(range.commonAncestorContainer.parentNode.previousElementSibling){
	        				var elem = range.commonAncestorContainer.parentNode.previousElementSibling;
	        				
	                range = sel.getRangeAt(0);
	        				range.selectNode(elem);
	                console.log(range);
	                console.log($(elem).text());
	                var len = $(elem).text().length;
	                console.log(len);
	                console.log(range.startContainer);
	               range.setStart(range.startContainer, len-1);
	                range.setEnd(range.startContainer, len-1);
	                console.log(range.startOffset);
	                console.log(range.endOffset);
	                sel.removeAllRanges();
	                sel.addRange(range);
	               	this.window.document.execCommand("forwardDelete");
	        			
	        			}
	        		}else{
	              range.setStart(range.startContainer, selectStart-1);
	              range.setEnd(range.startContainer, selectStart-1);
	              sel.removeAllRanges();
	              sel.addRange(range);
	             	this.window.document.execCommand("forwardDelete");
	        		}
	            
	          }else{
	          	this.window.document.execCommand("forwardDelete");
	          }
	        }
	      }*/
	    }
	  }
	  /**/
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  var Keyboard;
	  $(function(){
	  	Keyboard = function(options){
	  		this.field = new Field();
	  		this.logic = new KeyboardLogic(this, this.field, options);
	      this.keyCodes = options.keyCodes;
	  		
	  		
	  	// create hotkey combinations
	  		this.keyHots = [];
	    	for (var i = 0; i < options.combos.length; i++){
	    		this.keyHots[i] = new KeyHot(this, options.combos[i]);
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
	    	this.visual = new KeyboardVisual(this, options);
	      //this.visual.setLanguageTitles(0);
	    	this.browserFocused = true;
	    } 
	  	

	    Keyboard.prototype.setField = function(newField, newWindow, params){
	    	params = $.extend({
	    		animate: true
	    	}, params);
	    	this.animate = params.animate;
	    	this.field.focus(newField, newWindow);
	    };

	    Keyboard.prototype.fieldBlur = function(){
	    	this.field.blur();
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
	      		that.changeSymbols();
	      	}
	      	if(that.logic.kStatus.addit.physical){
	      		that.logic.keyAddit({from: "physical", status: "up"});
	      		that.visualKeyFunct('keyAddit', false);
	      		that.changeSymbols();
	      	}  		
	    	}, 12);
	    }
	    
	    Keyboard.prototype.addLetter = function(keyLetter){
	    	if(!this.field.active)
	    		return;
	    	this.logic.addLetter(keyLetter.currentSymbol);
	    	if(this.animate)
	    		keyLetter.visual.down();
	    	if(this.logic.additObserve()){
	  			this.changeSymbols();
	  			this.visualKeyFunct('keyAddit', false);	
	    	}
	    	if(this.logic.shiftObserve()){
	  			this.changeSymbols();
	  			this.visualKeyFunct('keyShift', false);	
	    	}
	    }

	    Keyboard.prototype.keyFunctionalAction = function(func, params){
	    	/*if(!this.field.active)
	    		return;*/
	      switch(func){
	  	    case "keyAddit":
	  	    	this.logic.keyAddit(params);
	  				this.changeSymbols();
	  				this.visualKeyFunct('keyAddit', this.logic.kStatus.addit.active);	
	  	  		break;
	  	    case "keyAdditLong":
	  	    	this.logic.keyAdditLong(params);
	  				this.changeSymbols();
	  				this.visualKeyFunct('keyAdditLong', this.logic.kStatus.additLong.active);	
	  	  		break;
	  	    case "keyBackspace":
	  				this.logic.keyBackspace();
	  	  		break;
	  	    case "keyCaps": 
	    			this.logic.keyCaps();
	    			this.changeSymbols();
	    			this.visualKeyFunct('keyCaps', this.logic.kStatus.caps.active);	
	  	  		break;
	  	    case "keyDelete": 
	  				this.logic.keyDelete();
	  				break;    
	  	    case "keyEnter": 
	  				this.logic.keyEnter();
	  				break;   
	  	    case "keyNextLanguage":
	    			this.logic.keyNextLanguage();
	    			this.changeLanguage();
	  	  		break;
	  	    case "keySpace": 
	    			this.logic.keySpace();
	  	  		break;
	  	    case "keyShift": 
	    			this.logic.keyShift(params);
	    			this.changeSymbols();
	    			this.visualKeyFunct('keyShift', this.logic.kStatus.shift.active);	
	  	  		break;
	      }
	    }
	    
	    Keyboard.prototype.changeLanguage = function(){
	    	var value = this.logic.kStatus.language.value;
	    	var status = {
	      		shift: this.logic.kStatus.shift.active,
	      		caps: this.logic.kStatus.caps.active,
	      		addit:  this.logic.kStatus.addit.active 			
	      	};
	    	for(var i = this.keyLetters.length-1; i > -1; i--){
	    		this.keyLetters[i].changeLayout(value, status);
	    	}
	  		this.visualKeyFunct('keyNextLanguage', true);
	  		var that = this;
	  		setTimeout(function(){
	  			that.visualKeyFunct('keyNextLanguage', false);
	  		}, 250);
	  		this.visual.setLanguageTitles(this.logic.kStatus.language.value);
	    }
	    
	    Keyboard.prototype.changeSymbols = function(){
	    	var value = {
	    		shift: this.logic.kStatus.shift.active,
	    		caps: this.logic.kStatus.caps.active,
	    		addit:  (this.logic.kStatus.addit.active ^ this.logic.kStatus.additLong.active)			
	    	};
	    	for(var i = this.keyLetters.length-1; i > -1; i--){
	    		this.keyLetters[i].changeStatus(value);
	    	}  	
	    }
	    
	    Keyboard.prototype.visualKeyFunct = function(func, bool){
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

	  //*******Physical Key Actions******************************************************
	    Keyboard.prototype.keyDown = function(event){
	    	/*if(!this.field.active)
	    		return;  */
	    	var code = event.keyCode;
	    	var isHappened = false;
	  		for(var i = this.keyHots.length-1; i > -1 ; i--){
	  			if(this.checkKeyHot(event, this.keyHots[i], code, "down")){
	  				if(!this.keyHots[i].thisSesson){
	  					this.keyHots[i].active = true;
	  					this.keyHots[i].action("down");
	  					this.keyHots[i].thisSesson = true;
	  				}
	  				isHappened =  true;
	  			}
	  		}
	  		if(!this.checkIsUsedSCANormal(event))
	  			return false;

	    	if(!this.field.active)
	    		return;
	    	
	    	for(var i = this.keyCodes.length-1; i > -1 ; i--){    	
	    		if( this.keyCodes[i] == code ){
	    			this.keyLetters[i].action();
	    			//this.keyLetters[i].visual.down();
	  				isHappened =  true;
	    		};
	    	}
	    	
	    	for(var i = this.keyFunctionals.length-1; i > -1 ; i--){
	    		if( this.keyFunctionals[i].code == code ){
	    			this.keyFunctionals[i].visual.down();
	    		};
	    	}
	  		if(isHappened){ 			
	  	    event.preventDefault();  //prevent default DOM action
	  	    event.stopPropagation();   //stop bubbling
	  		}
	    };  

	    Keyboard.prototype.keyUp = function(event){
	    	/*if(!this.field.active)
	    		return;*/
	  		var code = event.keyCode;
	  		var isHappened = false;
	  		for(var i = this.keyHots.length-1; i > -1 ; i--){
	  			if(this.checkKeyHot(event, this.keyHots[i], code, "up")){
	  					this.keyHots[i].action("up");
	  					this.keyHots[i].active = false;
	  					isHappened =  true;
	  			}
	  			this.keyHots[i].thisSesson = false;
	  			
	  		}
	  		for(var i = this.keyCodes.length-1; i > -1 ; i--){
	  			if( this.keyCodes[i] == code ){
	  				this.keyLetters[i].visual.up();
	  				isHappened =  true;
	  			};
	  		}
	    	for(var i = this.keyFunctionals.length-1; i > -1 ; i--){
	    		if( this.keyFunctionals[i].code == code ){
	    			this.keyFunctionals[i].visual.up();
	    		};
	    	}
	  		if(isHappened){ 	
	  	    event.preventDefault();  //prevent default DOM action
	  	//    event.stopPropagation();   //stop bubbling
	  		}
	    }
	    
	    Keyboard.prototype.checkKeyHot = function(event, keyHot, code, downOrUp){
	    	var ans =false;
	    	if(downOrUp == "down"){
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
	    	}else{
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
	    	}
	    	return ans;
	    };
	    
	    Keyboard.prototype.checkIsUsedSCANormal = function(event){
	    	var ctrl = false;
	    	var shift = false;
	    	var alt = false;
	    	for(var i = this.keyHots.length-1; i > -1 ; i--){
	    		if(this.keyHots[i].active){
	    			if (this.keyHots[i].alt){
	    				alt = true;
	    			}
	    			if (this.keyHots[i].ctrl){
	    				ctrl = true;
	    			}
	    			if (this.keyHots[i].shift){
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
	  });