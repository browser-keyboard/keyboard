var Field;
Field = function(){
  this.active = false;
  this.field = null;
  this.window = null;
}

Field.prototype.focus = function(newField, newWindow){
  this.active = true;
  this.field = newField;
  this.window = newWindow;
};

Field.prototype.blur = function(){
  this.active = false;
  this.field = null;
  this.window = null;
}

Field.prototype.addSymbol = function(word){
  if (!this.active)
    return;
  this.window.document.execCommand("insertText", false, word)
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

Field.prototype.enter = function(){
  if (!this.active)
    return;
  if($(this.field).is('textarea, input'))
    this.window.document.execCommand("insertText", false, '\n');
  else
    this.window.document.execCommand("insertParagraph");
}
