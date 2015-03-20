var HotKey;
$(function(){
	KeyHot = function(kb, combo){
		combo = $.extend({
			when: "while",
			alt: false,
			ctrl: false,
			shift: false,
			code: 0,
			keyFunction: '',
			func: ''
    }, combo);
		this.kb = kb;
		this.alt = combo.alt;
		this.ctrl = combo.ctrl;
		this.shift = combo.shift;
		this.code = combo.code;
		this.keyFunction = combo.keyFunction;
		this.when = combo.when;
		this.active = false;
		this.thisSesson = false;
		
		var that = this;
		this.action = function(downOrUp){
			downOrUp = downOrUp ? downOrUp : '';
			that.kb.keyFunctionalAction(combo.func,{from: "physical", status: downOrUp} );
		}
	}

});
