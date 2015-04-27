var Field;
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
  this.window.document.execCommand("insertText", false, word)
  /*var keyEvent = new KeyboardEvent("keydown", {key : "a", char : "a", shiftKey: true});
    
   this.window.document.dispatchEvent(keyEvent);
    */
  /*
  var obj =  { which: 75};
  obj.originalEvent = new KeyboardEvent("keypress");
  var e = $.Event("keypress",obj); //"keydown" if that's what you're doing
  $(this.window.document.body).trigger(e);
  */
  
  
  
  
  /*
     var eventObj = this.window.document.createEventObject ?
        this.window.document.createEventObject() : this.window.document.createEvent("Events");
  
    if(eventObj.initEvent){
      eventObj.initEvent("keypress", true, true);
    }
  
    eventObj.which = 1185;
    eventObj.charCode = 1185;
    
    this.window.document.body.dispatchEvent ? this.window.document.body.dispatchEvent(eventObj) : this.window.document.body.fireEvent("onpress", eventObj); 
  
  
  */
  
  
  
  try{
    
    
    
    /*var e = $.Event("keypress", { which: 1185, charCode: 1185}); //"keydown" if that's what you're doing
    $("body").trigger(e);*/
  //  $.event.trigger({ type : 'keypress', which : 1185 });
    
    /*if(this.window.document.execCommand("insertText", false, word)){
      isExecCommand = true;*/
    /*
            var start = this.selectionStart;
	    var end = this.selectionEnd;
	    var val = this.value;
            this.value = val.slice(0, start) + transformedChar + val.slice(end);
    }*/
  }
  catch(err) {
    isExecCommand = false;
  }
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
 /* var e = jQuery.Event("keypress");
  e.which = 13; //choose the one you want
  e.keyCode = 13;
  (this.field).trigger(e);
  */
  
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
      
