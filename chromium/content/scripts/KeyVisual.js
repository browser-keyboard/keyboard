var VirtualKeyLetter, VirtualKeyFuncts;
var MOUSE_LEFT_CLICK = 1;
var isPermittedEvent = function(e){
  return !((e.which != MOUSE_LEFT_CLICK) && (!e.type.includes('touch')))
}

VirtualKey = function(key, options){
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
	this.visual.bind('mousedown touchstart', function(e){
			if (!isPermittedEvent(e))
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
	this.visual.bind('mousedown touchstart', function(e){
			if (!isPermittedEvent(e))
				return;
				that.fromMouse = true;
	});
	this.visual.bind('mouseup mouseleave touchend', function(e){
			if (!isPermittedEvent(e))
				return;
			that.up();
	});
}

VirtualKeyLetter.prototype = Object.create(VirtualKey.prototype);

VirtualKeyFuncts = function(key, func, options){
	VirtualKey.apply(this,[key, options]);
	this.visual.addClass(func);
	var that = this;
	this.visual.bind('mousedown touchstart', function(e){
			if((that.logic.code == 0) || (!isPermittedEvent(e)))
				return;
			that.logic.kb.visual.keyFunctPress(that.logic.func, true);
	});
	this.visual.bind('mouseup mouseleave touchend', function(e){
			if((that.logic.code == 0) || (!isPermittedEvent(e)))
				return;
			that.logic.kb.visual.keyFunctPress(that.logic.func, false);
	});
}

VirtualKeyFuncts.prototype = Object.create(VirtualKey.prototype);
