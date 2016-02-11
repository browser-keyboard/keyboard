var KeyboardVisual = function(kb, options, userOptions){
	this.kb = kb;
  this.toShowOption = userOptions.show;

	if(this.toShowOption != 'newer')
		this.createContainer(options, userOptions);
}

KeyboardVisual.prototype.createContainer = function(options, userOptions){
  this.container = $('<div id=\'keyboardDiv\'></div>');
	this.container.attr('size', userOptions.size);
	this.container.attr('color', userOptions.color);
  if(this.toShowOption == 'on-active')
    this.container.css({display: 'none'});

  var dragger = $('<div id=\'keyboardDragger\'></div>');
  this.languageTitle = $('<div id=\'languageTitle\'></div>');
  this.languageNames = [];
  this.languageShortNames = [];
  for (var i = 0; i < options.languageSet.length; i++) {
  	this.languageNames[i] = options.languageSet[i].name;
  	this.languageShortNames[i] = options.languageSet[i].shortName ;
  }
  dragger.append(this.languageTitle);

  this.visual = $('<div id=\'aftan-keyboard\'>');
  this.container.on("mousedown", function(e){
    // for not miss field focus
    e.preventDefault();
    e.stopPropagation();
  });

  dragger.appendTo(this.container);

  this.createButtons(options);

  this.container.append(this.visual);
  this.container.prependTo('html');
	this.container.pep({
		handle: dragger,
		shouldEase: false,
		constrainTo: 'window',
		startPos:{
			left: $(window).width() - this.container.width() - 25,
			top: $(window).height() - this.container.height() - 25
		}
	});

  this.setLanguageTitles(0);
}

KeyboardVisual.prototype.createButtons = function(options){
  var keyWordCount = 0;
	var keyFunctionalCount = 0;
	var attr = {};

	//keyboardOption.keySet по строкам
	for (var i1 = 0; i1 < options.keySet.length; i1++) {
  var line = $('<div class="aftan-keyboard-line"></div>');
  attr.sideIn = "left";
	  //keyboardOption.keySet по элементам
	  for (var i2 = 0; i2 < options.keySet[i1].length; i2++) {
	  attr.width = undefined;
	  attr.title = undefined;
		  if(options.keySet[i1][i2] == 'layout'){
			  // по колличеству элементов в первой расскладке
			  for (var i3 = 0; i3 < options.languageSet[0].letterSet[i1].length; i3++) {
				  var key = this.kb.keyLetters[keyWordCount].createVisual();
				  line.append(key);
				  keyWordCount++;
			  }
			  attr.sideIn = "right";
		  }else{
			  attr.width = options.keySet[i1][i2].width;
			  attr.title = options.keySet[i1][i2].title;
			  var key = this.kb.keyFunctionals[keyFunctionalCount].createVisual(attr);
			  line.append(key);

			  if(this.kb.keyFunctionals[keyFunctionalCount].func == "keySpace")
				  attr.sideIn = "right";
        if( this.kb.keyFunctionals[keyFunctionalCount].func == 'keyNextLanguage' )
          this.keyNextLanguage = this.kb.keyFunctionals[keyFunctionalCount].visual;

			  keyFunctionalCount++;
		  }
	  }
	  this.visual.append(line);
  }
}

KeyboardVisual.prototype.setLanguageTitles = function(num){
	if(this.toShowOption != 'newer'){
  	this.languageTitle.text(this.languageNames[num]);
    this.keyNextLanguage.setDisplayKeyText(this.languageShortNames[num]);
  }
}

KeyboardVisual.prototype.show = function(){
	this.container.show();
}
KeyboardVisual.prototype.hide = function(){
	this.container.hide();
}

KeyboardVisual.prototype.keyFunctPressByKeyObject = function(keyObject, bool){
  if(this.toShowOption != 'newer')
    if(bool)
      keyObject.visual.down();
    else
      keyObject.visual.up();
}

KeyboardVisual.prototype.keyFunctPress = function(func, bool){
	if(this.toShowOption == 'newer')
		return;
	for(var i = this.kb.keyFunctionals.length-1; i > -1 ; i--)
		if(this.kb.keyFunctionals[i].func == func)
      this.keyFunctPressByKeyObject(this.kb.keyFunctionals[i], bool)
}

KeyboardVisual.prototype.keyFunctSyncByKStatus = function(kStatus){
  if(this.toShowOption != 'newer')
    for(var i = this.kb.keyFunctionals.length-1; i > -1 ; i--)
      switch(this.kb.keyFunctionals[i].func){
        case 'keyShift':
          this.keyFunctPressByKeyObject(this.kb.keyFunctionals[i], kStatus.shift.active);
          break;
        case 'keyCaps':
          this.keyFunctPressByKeyObject(this.kb.keyFunctionals[i], kStatus.caps.active);
          break;
        case 'keyAddit':
          this.keyFunctPressByKeyObject(this.kb.keyFunctionals[i], kStatus.addit.active);
          break;
      }
}

KeyboardVisual.prototype.keyDown = function(code){
	if(this.toShowOption == 'newer')
		return;
	for(var i = this.kb.keyFunctionals.length-1; i > -1 ; i--)
		if( this.kb.keyFunctionals[i].code == code ){
			this.kb.keyFunctionals[i].visual.down();
			return;
		}
	if(!this.kb.animate)
		return;
	for(var i = this.kb.keyCodes.length-1; i > -1 ; i--)
		if( this.kb.keyCodes[i] == code ){
			this.kb.keyLetters[i].visual.down();
				return;
		}
}

KeyboardVisual.prototype.keyUp = function(code){
	if(this.kb.toShowOption == 'newer')
		return;
	for(var i = this.kb.keyFunctionals.length-1; i > -1 ; i--)
		if( this.kb.keyFunctionals[i].code == code ){
			this.kb.keyFunctionals[i].visual.up();
			return;
		}
	if(!this.kb.animate)
		return;
	for(var i = this.kb.keyCodes.length-1; i > -1 ; i--)
		if( this.kb.keyCodes[i] == code ){
			this.kb.keyLetters[i].visual.up();
			return;
		}
}

KeyboardVisual.prototype.destroy = function(){
	if(this.toShowOption != 'newer')
		this.container.remove();
}
