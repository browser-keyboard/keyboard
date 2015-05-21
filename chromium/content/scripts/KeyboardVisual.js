var KeyboardVisual;
KeyboardVisual = function(kb, options, userOptions){
    this.kb = kb;		
		this.hover = false;
    
    var that = this;
		
    this.container = $('<div id=\'keyboardDiv\'></div>');
		this.container.attr('size', userOptions.size);
		this.container.attr('color', userOptions.color);
    if(this.kb.visualOption == 'on-active')
      this.container.css({display: 'none'});

    var dragger = $('<div id=\'keyboardDragger\'></div>');
    this.languageTitle = $('<div id=\'languageTitle\'></div>');
    this.languageNames = [];
    this.languageShortNames = [];
    for (var i = 0; i < options.languageSet.length; i++) {
    	this.languageNames[i] = options.languageSet[i].name;
    	this.languageShortNames[i] =options.languageSet[i].shortName ;
    }
    dragger.append(this.languageTitle);
    
    var controlsDiv = $('<div id=\'controlsDiv\'></div>');
    var closeControl = $('<div id=\'close\'>E</div>');
    closeControl.click(function(){
    	//that.kb.reverse();
      chrome.runtime.sendMessage({eve: "activision", status: false});
    });
    controlsDiv.append(closeControl);
    dragger.append(controlsDiv);
    
    this.visual = $('<div id=\'aftan-keyboard\'>');
    var that = this;
    this.container.on("mousedown", function(e){
      e.preventDefault();  //prevent default DOM action
      e.stopPropagation();   //stop bubbling        
    });
    
    dragger.appendTo(this.container);
   // var bod = $('body')[0];
    
  	var keyWordCount = 0;
  	var keyFunctionalCount = 0;
  	
  	var attr = {
			sideIn: "left"
  	};

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
				  keyFunctionalCount++;
			  }
		  }			
		  this.visual.append(line);
	  }
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

KeyboardVisual.prototype.setLanguageTitles = function(num){
	this.languageTitle.text(this.languageNames[num]);

	for(var i = this.kb.keyFunctionals.length-1; i > -1 ; i--){
		if( this.kb.keyFunctionals[i].func == 'keyNextLanguage' ){
			this.kb.keyFunctionals[i].visual.setDisplayKeyText(this.languageShortNames[num]);
		};
	}
}

KeyboardVisual.prototype.show = function(){
	this.container.show();
}
KeyboardVisual.prototype.hide = function(){
	this.container.hide();
}

