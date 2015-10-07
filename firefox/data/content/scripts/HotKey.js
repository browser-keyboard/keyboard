var HotKey = function(kb, combo){
	combo = $.extend({
		when: "while",
		alt: false,
		ctrl: false,
		shift: false,
		meta: false,
		code: 0,
		keyFunction: '',
		func: ''
	}, combo);
	this.kb = kb;
	this.alt = combo.alt;
	this.ctrl = combo.ctrl;
	this.shift = combo.shift;
	this.code = combo.code;
	this.meta = combo.meta;
	this.keyFunction = combo.keyFunction;
	this.func = combo.func;
	this.when = combo.when;
	this.active = false;
	this.thisSesson = false;
}

HotKey.prototype.action = function(downOrUp){
	downOrUp = downOrUp ? downOrUp : '';
	this.kb.keyFunctionalAction(this.func,{from: "physical", status: downOrUp} );
}
