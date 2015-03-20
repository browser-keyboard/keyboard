var Field;
$(function(){
	Field = function(){
		this.active = false;
		this.field = null;
		this.document = null;
		this.type = undefined;
	}
	
	Field.prototype.focus = function(newField, newDoc){
    this.field = newField;
    this.document = newDoc;
    this.type = $(this.field).is('textarea, input') ? 'input' : 'contentEditable' ;
  };
	
	Field.prototype.blur = function(){
		this.field = null;
		this.document = null;
		this.type = undefined;		
	}
	
	Field.prototype.addSymbol = function(word){
    var isExecCommand = false;
    try{
      if(this.document.execCommand("insertText", false, word)){
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
	  var isExecCommand = false;
	  try{
	    if(this.document.execCommand("delete")){
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
	  var isExecCommand = false;
	  try{
	    if(this.document.execCommand("forwardDelete")){
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
  	if($(this.field).is('textarea, input'))
    	this.document.execCommand("insertText", false, '\n');
  	else
  		this.document.execCommand("insertParagraph");
  }
  
  Field.prototype.shiftEnter = function(){
  	this.document.execCommand("formatBlock", false, '<br>');
  }
});
