var VirtualKeyLetter, VirtualKeyFuncts;
VirtualKey = function(key, options){
				this.logic = key; // Key class
				this.MOUSE_LEFT_CLICK = 1;
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
			if (e.which != that.MOUSE_LEFT_CLICK)
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
			if (e.which != that.MOUSE_LEFT_CLICK)
				return;
				that.fromMouse = true;
	});
	this.visual.bind('mouseup mouseleave', function(e){
			if ((e.which != that.MOUSE_LEFT_CLICK) || (!that.fromMouse))
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
			if((that.logic.code == 0) || (e.which != that.MOUSE_LEFT_CLICK))
				return;
			that.logic.kb.visual.keyFunctPress(that.logic.func, true);
	});
	this.visual.bind('mouseup mouseleave', function(e){
			if((that.logic.code == 0) || (e.which != that.MOUSE_LEFT_CLICK))
				return;
			that.logic.kb.visual.keyFunctPress(that.logic.func, false);
	});
}

VirtualKeyFuncts.prototype = Object.create(VirtualKey.prototype);
