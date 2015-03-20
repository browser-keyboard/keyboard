var VirtualKeyLetter, VirtualKeyFuncts;
$(function(){
	VirtualKey = function(key, options){
		option = $.extend({
			width: 30
		},options);
		this.logic = key; // Key class
		this.visual = $('<div data-clicked=\'false\' class=\'aftan-keyboard-key\'/>');
		this.setDisplayKeyText(options.title);
		switch (options.sideIn) {
		case "left":
			this.visual.attr('sideIn', 'left');
			break;
		case "right":
			this.visual.attr('sideIn', 'right');
			break;
		}
		
		this.fromMouse = false;
    var that = this;
    this.visual.bind('mousedown', function(e){
    	if (e.which != 1)
    		return;
      that.logic.action();
    	that.fromMouse = true;
    });
    this.setDisplayKeyText(key.currentSymbol);    
	}
	
	VirtualKey.prototype.setDisplayKeyText = function(text){
    this.visual.text(text);
  }

	VirtualKey.prototype.down = function(){
    this.visual.attr('clicked', 'true');    
  }

	VirtualKey.prototype.up = function(){
    this.visual.attr('clicked', 'false');
    this.fromMouse = false;
  }

	VirtualKeyLetter = function(key, options){
  	VirtualKey.apply(this,[key, options]);
  	
  	var that = this;
    this.visual.bind('mousedown', function(e){
    	if (e.which != 1)
    		return;
    	this.fromMouse = true;
    });
    this.visual.bind('mouseup mouseleave', function(e){
    	if ((e.which != 1) || (!that.fromMouse))
    		return;
    	that.up();
    });
  }

  VirtualKeyLetter.prototype = Object.create(VirtualKey.prototype);

  VirtualKeyFuncts = function(key, func, options){
  	VirtualKey.apply(this,[key, options]);
  	this.visual.addClass(func);
  	var that = this;
    this.visual.bind('mousedown', function(e){
    	if((that.logic.code == 0) || (e.which != 1))
    		return;
    	that.logic.kb.visualKeyFunct(that.logic.func, true);
    });
    this.visual.bind('mouseup mouseleave', function(e){
    	if((that.logic.code == 0) || (e.which != 1))
    		return;
    	that.logic.kb.visualKeyFunct(that.logic.func, false);
    });
  }

  VirtualKeyFuncts.prototype = Object.create(VirtualKey.prototype);
  
});
