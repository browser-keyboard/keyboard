ENGISHLAYOUT = {
	"id": 1,
	"name" : "English",
	"shortName": "en",
	"letterSet" : [
				[
						[{}, "`", "~","~","~"],
						[{"caps": false}, "1", "!","1","!"],
						[{"caps": false}, "2", "@","2","@"],
						[{"caps": false}, "3", "#","3","#"],
						[{"caps": false}, "4", "$","4","$"],
						[{"caps": false}, "5", "%","5","%"],
						[{"caps": false}, "6", "^","6","^"],
						[{"caps": false}, "7", "&","7","&"],
						[{"caps": false}, "8", "*","8","*"],
						[{"caps": false}, "9", "(","9","("],
						[{"caps": false}, "0", ")","0",")"],
						[{"caps": false}, "-", "_","-","_"],
						[{"caps": false}, "=", "+","=","+"]
				],[
						[{}, "q", "Q","!",""],
						[{}, "w", "W","@",""],
						[{}, "e", "E","#",""],
						[{}, "r", "R","$",""],
						[{}, "t", "T","%",""],
						[{}, "y", "Y","^",""],
						[{}, "u", "U","&",""],
						[{}, "i", "I","*",""],
						[{}, "o", "O","(",""],
						[{}, "p", "P",")",""],
						[{}, "[", "}","_",""],
						[{}, "]", "{","+",""],
						[{}, "\\", "|","",""]
				],[
						[{}, "a", "A","«",""],
						[{}, "s", "S","»",""],
						[{}, "d", "D","€",""],
						[{}, "f", "F","£",""],
						[{}, "g", "G","¥",""],
						[{}, "h", "H","©",""],
						[{}, "j", "J","®",""],
						[{}, "k", "K","÷",""],
						[{}, "l", "L","",""],
						[{}, ";", ":","",""],
						[{}, "'", "\"","",""]
				],[
						[{}, "z", "Z","",""],
						[{}, "x", "X","",""],
						[{}, "c", "C","",""],
						[{}, "v", "V","",""],
						[{}, "b", "B","",""],
						[{}, "n", "N","",""],
						[{}, "m", "M","",""],
						[{}, ",", "<","",""],
						[{}, ".", ">","",""],
						[{}, "/", "?","",""]
				]
			]
};

//	подключение api браузера для рассширения
var ss = require("sdk/simple-storage").storage;
var array = require('sdk/util/array');
var data = require("sdk/self").data;
var { ToggleButton } = require('sdk/ui/button/toggle');
var pageMod = require("sdk/page-mod");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");

//	восстановление настройкей клавиатуры из storage: текуший язык, видимость и активность
if(ss.isActive === undefined){
	ss.isActive = true;
}

if(ss.userOptions === undefined){
	var userOptions = {};
	userOptions.show = 'always';
	userOptions.capture = true;
	userOptions.langToSave = true;
	userOptions.size = "standart";
	userOptions.color = "white";
	ss.userOptions = userOptions;
}

if((ss.languageList === undefined) || (!ss.languageList[0])){
	ss.languageList = [ENGISHLAYOUT];
}
var kStatus = {
shift:{
		physical: false,
		active: false
	},
	caps: {
	active: false
	},
	addit: {
		physical: false,
		active: false    		
	},
	additLong: {
		active: false
	},
	language: {
		value: 0
	}
};
if(ss.currentLanguage === undefined){
	ss.currentLanguage = 0;
}
kStatus.language.count = ss.languageList.length;
if(!ss.userOptions.langToSave)
	kStatus.language.value = ss.currentLanguage;

var createLangList = function(){
	var list = [];
	var langs = ss.languageList;
	for(var i=0; i<langs.length; i++){
		list.push(langs[i].shortName);
	}
	return list;
}
var langsNames = createLangList();

var currentTab;
//	состояние функциональных клавиш
		
// горячая клавиша для влючения/отключения клавиатуры
var { Hotkey } = require("sdk/hotkeys");
var hotKeyToActivate = Hotkey({
	combo: "alt-k",
	onPress: function() {
		factivision(!ss.isActive);
	}
});

//	кнопка и панель на адрес баре браузера
var button = ToggleButton({
	id: "style-tab",
	label: "Browser Keyboard",
	icon: "icons/16.png",
	icon: {
		"16": "./icons/16.png",
		"32": "./icons/32.png",
	},
	badgeColor: "#111",
	badge: langsNames[kStatus.language.value],
	onChange: handleChange
});
// функция для показа понели настроек при нажатии на кнопку
function handleChange(state) {
	if (state.checked) {
		panel.show({
			position: button
		});
	}
}

var panels = require("sdk/panel");
var panel = panels.Panel({
	contentURL: data.url("panel/panel.html"),
	contentStyleFile: data.url("panel/style.css"),
	contentScriptFile: [data.url("libs/jquery.js"), data.url("objects.js"), data.url("panel/script.js")],
	onHide: handleHide,
	width: 180,
	height: (90 + 45 * (ss.languageList.length))
});
function handleHide(){
	button.state('window', {checked: false});
}
panel.port.on('changeLanguage', function(params){
	ss.currentLanguage = params;
	kStatus.language.value = params;
	fChangeSymbols(kStatus);
	if(!ss.active){
		ss.active = true;
		factivision(true);
	}
});
panel.port.on('openOptions', function(){
	fOpenOptions();
});
panel.port.on('activision', function(params){
	factivision(params);
});
panel.port.emit('activision', ss.isActive);
panel.port.emit('languageList', ss.languageList);
panel.port.emit('changeLanguage', ss.currentLanguage);


var fSetField, fkeyDown, fkeyUp, fBrowserBlur, fBrowserFocus, fTopChangeLanguage; // functions 
var fKeyDownToFrame, fSimpleEnter, fShiftEnter, fDeleting, fBackspacing, fAddLetter;

var topPages = [];
var workers = [];

// 	логика изменения состояния и визуальная часть
pageMod.PageMod({
	include: "*",
	attachTo: ["top"],
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("include/jquery.js"), data.url("objects.js"), data.url("include/jquery.pep.js"), data.url("visual/scripts/Key.js"), 
		data.url("visual/scripts/KeyboardLogic.js"), data.url("visual/scripts/KeyboardVisual.js"), data.url("visual/scripts/KeyVisual.js"),
		data.url("visual/scripts/Keyboard.js"), data.url("visual/scripts/connect.js") ],
	contentStyleFile: [data.url("visual/css/style.css"), data.url('include/fonts/symbols.otf')],
	onAttach: function(worker){
			
		array.add(topPages, worker);
		worker.on('pageshow', function() { array.add(topPages, this); });
		worker.on('pagehide', function() { array.remove(topPages, this); });
		worker.on('detach', function() { array.remove(topPages, this); })
		
		if(ss.isActive){
			worker.port.emit('create', {userOptions: ss.userOptions, languageList: ss.languageList});
			worker.port.emit('changeSymbols', kStatus);
		}
		worker.port.on('changeSymbols', function(params){
			fChangeSymbols(params);
		});
		worker.port.on('activision', function(params){
			ss.active = params;
			factivision(params);
		});
		worker.port.on('functional', function(params){
			fFunctional(params);
		});
		worker.port.on('addLetter', function(massage){
			fAddLetter(massage);
		});
	}
});

//	логика работы с текстовым полем и нажатием физических клавиш
pageMod.PageMod({
	include: "*",
	attachTo: ["frame", "top"],
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("libs/jquery.js"), data.url("objects.js"), data.url("content/scripts/Field.js"),
		data.url("content/scripts/HotKey.js"), data.url("content/scripts/Key.js"), data.url("content/scripts/KeyboardLogic.js"), 
		data.url("content/scripts/Keyboard.js"), data.url("content/scripts/connect.js") ],
	onAttach: function(worker){
		
		array.add(workers, worker);
		worker.on('pageshow', function() { array.add(workers, this); });
		worker.on('pagehide', function() { array.remove(workers, this); });
		worker.on('detach', function() { array.remove(workers, this); })
		
		if(ss.isActive){
			worker.port.emit('create', {userOptions: ss.userOptions, languageList: ss.languageList});
			worker.port.emit('changeSymbols', kStatus);
		}
		worker.port.on('setField', function(params){
			fSetField(params);
		});	
		worker.port.on('changeSymbols', function(params){
			fChangeSymbols(params);
		});
		worker.port.on('blurField', function(){
			fBlurField();
		});
		worker.port.on('KeyDown', function(params){
			fKeyDown(params);
		});
		worker.port.on('KeyUp', function(params){
			fKeyUp(params);
		});
	}
});


f_turnOn = function(){
	for(var i=0; i < topPages.length; i++){
		topPages[i].port.emit('create', {userOptions: ss.userOptions, languageList: ss.languageList});
		topPages[i].port.emit('changeSymbols', kStatus);
	}
	for(var i=0; i < workers.length; i++){
		workers[i].port.emit('create', {userOptions: ss.userOptions, languageList: ss.languageList});
		workers[i].port.emit('changeSymbols', kStatus);
	}
	button.badge = langsNames[kStatus.language.value];
}
f_turnOff = function(){
	for(var i=0; i < topPages.length; i++){
		topPages[i].port.emit('destroy');
	}
	for(var i=0; i < workers.length; i++){
		workers[i].port.emit('destroy');
	}
	button.badge = "";
}

//	включает/отключает клавиатуры
factivision = function(params){
	ss.isActive = params;
	if(params)
		f_turnOn();
	else
		f_turnOff();
	panel.port.emit('activision', ss.isActive);
}

// меняет символы
fChangeSymbols = function(params){
	if(!ss.isActive)
		return;
	try{
		for(var i=0; i < workers.length; i++){
			if(workers[i].tab.id == currentTab){
				workers[i].port.emit('changeSymbols', params);
			}
		}
		for(var i=0; i < topPages.length; i++)
			if(topPages[i].tab.id == currentTab){
				topPages[i].port.emit('changeSymbols', params);
			}
	}finally {}
	kStatus = params;
	ss.currentLanguage = params.language.value;
	button.badge = langsNames[params.language.value];
}

fFunctional = function(params){
	for(var i=0; i < workers.length; i++)
		if(workers[i].tab.id == currentTab)
			workers[i].port.emit('functional', params);
}
fAddLetter = function(params){
	for(var i=0; i < workers.length; i++)
		if(workers[i].tab.id == currentTab)
			workers[i].port.emit('addLetter', params);
}

fSetField = function(params){
	if(!ss.isActive)
		return;
	for(var i=0; i < topPages.length; i++)
		if(topPages[i].tab.id == currentTab)
			topPages[i].port.emit('setField', params);
	for(var i=0; i < workers.length; i++)
		if(workers[i].tab.id == currentTab){
			workers[i].port.emit('changeSymbols', kStatus);
		}
};
fBlurField = function(){
	for(var i=0; i < topPages.length; i++)
		if(topPages[i].tab.id == currentTab)
			topPages[i].port.emit('blurField');
};

fKeyDown = function(params){
	for(var i=0; i < topPages.length; i++)
		if(topPages[i].tab.id == currentTab)
			topPages[i].port.emit('keyDown', params);
};
fKeyUp = function(params){
	for(var i=0; i < topPages.length; i++)
		if(topPages[i].tab.id == currentTab)
			topPages[i].port.emit('keyUp', params);
}

windows.on('activate', function() {
	if(ss.isActive)
		for(var i=0; i < topPages.length; i++){
			topPages[i].port.emit('browserFocus');
		}
});
windows.on('deactivate', function() {
	if(ss.isActive)
		for(var i=0; i < topPages.length; i++){
			topPages[i].port.emit('browserBlur');
		}
});

tabs.on('activate', function onOpen(tab) {
	currentTab = tab.id;
	if(ss.isActive)
		fChangeSymbols(kStatus);
});


// Глобальные настройки раскладок
var optionPage;
pageMod.PageMod({
	include: [data.url("options/index.html"), data.url("browser-keyboard.github.io/*")],
	contentScriptFile: [data.url("include/angular.js"), data.url("options/script.js")],
	contentStyleFile: [data.url("include/paper.css"), data.url("options/style.css")],
	onAttach: function(worker){
		optionPage = this;
		
		if(ss.isActive){
			worker.port.emit('create', {userOptions: ss.userOptions, languageList: ss.languageList});
			worker.port.emit('changeSymbols', kStatus);
		}
		worker.port.on('reset', function(){
			f_resetOptions();
		});	
		worker.port.on('save', function(params){
			f_saveOptions(params);
		});
	}
});

f_resetOptions = function(){
	optionPage.port.emit('setInfo', {isActive: ss.isActive, languageList: ss.languageList, userOptions: ss.userOptions});
}
f_saveOptions = function(params){
	if (ss.isActive)
		f_turnOff();
	
	ss.isActive = params.isActive;
	ss.languageList = params.languageList;
	ss.userOptions = params.userOptions;
	
	kStatus.language.count = ss.languageList.length;
	kStatus.language.value = 0;
	
	panel.height = (90 + 45 * (ss.languageList.length));
	panel.port.emit('languageList', ss.languageList);
	
	if (ss.isActive)
		f_turnOn();
	langsNames = createLangList();
	button.badge = langsNames[0];
}
var optionPage;
fOpenOptions = function(){
	tabs.open(data.url("options/index.html"));
}

if(ss.isActive)
	f_turnOn();
