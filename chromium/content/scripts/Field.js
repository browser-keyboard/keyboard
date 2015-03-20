var Field;
$(function(){
	Field = function(){
		this.active = false;
		this.field = null;
		this.window = null;
		this.type = undefined;
	}
	
	Field.prototype.focus = function(newField, newWindow){
		this.active = true;
    this.field = newField;
    this.window = newWindow;
    this.type = $(this.field).is('textarea, input') ? 'input' : 'contentEditable' ;
  };
	
	Field.prototype.blur = function(){
		this.active = false;
		this.field = null;
		this.window = null;
		this.type = undefined;		
	}
	
	Field.prototype.addSymbol = function(word){
    if (!this.active)
      return;
    var isExecCommand = false;
    try{
      if(this.window.document.execCommand("insertText", false, word)){
      	isExecCommand = true;
      }
    }
    catch(err) {
      isExecCommand = false;
    }
    if((!isExecCommand) && $(this.field).is('textarea, input')){
      var selectStart = this.field.selectionStart;
      var selectEnd = this.field.selectionEnd;
      var textBegin = this.field.value.substring(0,selectStart);
      var textEnd = this.field.value.substring(selectEnd,this.field.value.length);
      this.field.value = textBegin + word + textEnd;
  		this.field.setSelectionRange(selectStart+1,selectStart+1);
  		
    };
	}
	
  Field.prototype.backspacing = function(){
  	if (!this.active)
	    return;
	  var isExecCommand = false;
	  try{
	    if(this.window.document.execCommand("delete")){
	    	isExecCommand = true;
	    }
	  }
	  catch(err) {
	    isExecCommand = false;
	  }
	  if((!isExecCommand) && $(this.field).is('textarea, input')){
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
	  };
  }
  
  
  Field.prototype.deleting = function(){
  	if (!this.active)
	    return;
	  var isExecCommand = false;
	  try{
	    if(this.window.document.execCommand("forwardDelete")){
	    	isExecCommand = true;
	    }
	  }
	  catch(err) {
	    isExecCommand = false;
	  }
	  if((!isExecCommand) && $(this.field).is('textarea, input')){
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
	  };
  }
  
  Field.prototype.simpleEnter = function(){
  	if (!this.active)
	    return;
  	if($(this.field).is('textarea, input'))
    	this.window.document.execCommand("insertText", false, '\n');
  	else
  		this.window.document.execCommand("insertParagraph");
  }
  
  Field.prototype.shiftEnter = function(){
  	if (!this.active)
	    return;
  	this.window.document.execCommand("formatBlock", false, '<br>');
  }
	
});
