$(function(){
	if( typeof Object.create === undefined ){
		Object.create = function(prototype){
			function C(){};
			C.prototype = protorype;
			return new C();
		};		
	}

	var user_agent = navigator.userAgent.toLowerCase();
	if(user_agent.indexOf('firefox') != -1){
		for (var i = 0; i < keyboardOption.keyCodes.length; i++) {
			switch (keyboardOption.keyCodes[i]) {
			case 186:
				keyboardOption.keyCodes[i] = 59;
				break;
			case 187:
				keyboardOption.keyCodes[i] = 61;
				break;
			case 189:
				keyboardOption.keyCodes[i] = 173;
				break;
			}
		}
	};
	
	
});
