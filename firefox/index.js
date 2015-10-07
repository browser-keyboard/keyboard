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

//	Firefox API
var storage = require("sdk/simple-storage").storage;
var array = require('sdk/util/array');
var data = require("sdk/self").data;
var { ToggleButton } = require('sdk/ui/button/toggle');
var pageMod = require("sdk/page-mod");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");

// set default options
if(storage.isActive === undefined){
	storage.isActive = true;
}

if(storage.userOptions === undefined){
	var userOptions = {};
	userOptions.show = 'always';
	userOptions.capture = true;
	userOptions.langToSave = true;
	userOptions.size = "standart";
	userOptions.color = "white";
	storage.userOptions = userOptions;
}

if((storage.languageList === undefined) || (!storage.languageList[0])){
	storage.languageList = [ENGISHLAYOUT];
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
if(storage.currentLanguage === undefined){
	storage.currentLanguage = 0;
}
kStatus.language.count = storage.languageList.length;
if(storage.userOptions.langToSave)
	kStatus.language.value = storage.currentLanguage;

var createLangNamesArray = function(){
	var list = [];
	var langs = storage.languageList;
	for(var i=0; i<langs.length; i++){
		list.push(langs[i].shortName);
	}
	return list;
}
var langsNames = createLangNamesArray();

// Hot Key to switch On/Off
var { Hotkey } = require("sdk/hotkeys");
var hotKeyToActivate = Hotkey({
	combo: "alt-k",
	onPrestorage: function() {
		setActive(!storage.isActive);
	}
});

// button on panel
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
	onChange: PanelToShow
});

function PanelToShow(state) {
	if (state.checked) {
		panel.show({
			position: button
		});
	}
}
var panel = require("sdk/panel").Panel({
	contentURL: data.url("panel/panel.html"),
	contentStyleFile: data.url("panel/style.css"),
	contentScriptFile: [data.url("include/jquery.js"), data.url("objects.js"), data.url("panel/script.js")],
	onHide: onPanelHede,
	width: 180,
	height: (90 + 45 * (storage.languageList.length))
});
function onPanelHede(){
	button.state('window', {checked: false});
}
panel.port.on('changeLanguage', function(params){
	storage.currentLanguage = params;
	kStatus.language.value = params;
	changeSymbols(kStatus);
	if(!storage.isActive){
		storage.isActive = true;
		setActive(true);
	}
});
panel.port.on('openOptions', function(){
	openOptionsPage();
});
panel.port.on('activision', function(params){
	setActive(params);
});
panel.port.emit('activision', storage.isActive);
panel.port.emit('languageList', storage.languageList);
panel.port.emit('changeLanguage', storage.currentLanguage);

var visualPages = [];
var contentPages = [];

// 	Visual Keyboard
pageMod.PageMod({
	include: "*",
	attachTo: ["top"],
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("include/jquery.js"), data.url("objects.js"), data.url("include/jquery.pep.js"), data.url("visual/scripts/Key.js"),
		data.url("visual/scripts/KeyboardLogic.js"), data.url("visual/scripts/KeyboardVisual.js"), data.url("visual/scripts/KeyVisual.js"),
		data.url("visual/scripts/Keyboard.js"), data.url("visual/scripts/connect.js") ],
	contentStyleFile: [data.url("visual/css/style.css")],
	onAttach: function(worker){
		worker.on('pageshow', function() { visualPages.push(this);});
		worker.on('pagehide', function() {
			var index = visualPages.indexOf(this);
			if (index > -1)
			    visualPages.splice(index, 1);
		})
		worker.on('detach', function() {
			var index = visualPages.indexOf(this);
			if (index > -1)
			    visualPages.splice(index, 1);
		})

		if(storage.isActive){
			worker.port.emit('create', {userOptions: storage.userOptions, languageList: storage.languageList});
			worker.port.emit('changeSymbols', kStatus);
		}
		worker.port.on('changeSymbols', function(params){
			changeSymbols(params);
		});
		worker.port.on('activision', function(params){
			storage.active = params;
			setActive(params);
		});
		worker.port.on('functional', function(params){
			pressFuncButtonInContentPages(params);
		});
		worker.port.on('addLetter', function(params){
			addLetterIncontentPages(params);
		});
	}
});

//	логика работы с текстовым полем и нажатием физических клавиш
pageMod.PageMod({
	include: "*",
	attachTo: ["frame", "top"],
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url("include/jquery.js"), data.url("objects.js"), data.url("content/scripts/Field.js"),
		data.url("content/scripts/HotKey.js"), data.url("content/scripts/Key.js"), data.url("content/scripts/KeyboardLogic.js"),
		data.url("content/scripts/KeyboardPhysical.js"), data.url("content/scripts/Keyboard.js"), data.url("content/scripts/connect.js") ],
	onAttach: function(worker){
		//contentPages.push(this);
		worker.on('pageshow', function() { contentPages.push(this); });
		worker.on('pagehide', function() {
			var index = contentPages.indexOf(this);
			if (index > -1)
			    contentPages.splice(index, 1);
		})
		worker.on('detach', function() {
			var index = contentPages.indexOf(this);
			if (index > -1)
			    contentPages.splice(index, 1);
		})


		if(storage.isActive){
			worker.port.emit('create', {userOptions: storage.userOptions, languageList: storage.languageList});
			worker.port.emit('changeSymbols', kStatus);
		}
		worker.port.on('setField', function(params){
			setField(params);
		});
		worker.port.on('changeSymbols', function(params){
			changeSymbols(params);
		});
		worker.port.on('blurField', function(){
			blurField();
		});
		worker.port.on('KeyDown', function(params){
			pressKeyDownInVisual(params);
		});
		worker.port.on('KeyUp', function(params){
			pressKeyUpInVisual(params);
		});
	}
});


setActive = function(params){
	storage.isActive = params;
	if(params)
		switchOn();
	else
		switchOff();
	panel.port.emit('activision', storage.isActive);
}

switchOn = function(){
	for(var i=0; i < visualPages.length; i++){
		visualPages[i].port.emit('create', {userOptions: storage.userOptions, languageList: storage.languageList});
		visualPages[i].port.emit('changeSymbols', kStatus);
	}
	for(var i=0; i < contentPages.length; i++){
		contentPages[i].port.emit('create', {userOptions: storage.userOptions, languageList: storage.languageList});
		contentPages[i].port.emit('changeSymbols', kStatus);
	}
	button.badge = langsNames[kStatus.language.value];
}
switchOff = function(){
	for(var i=0; i < visualPages.length; i++){
		visualPages[i].port.emit('destroy');
	}
	for(var i=0; i < contentPages.length; i++){
		contentPages[i].port.emit('destroy');
	}
	button.badge = "";
}

changeSymbols = function(params){
	if(!storage.isActive)
		return;
	for(var i=0; i < contentPages.length; i++)
		if((!contentPages[i].tab) || (contentPages[i].tab.id == tabs.activeTab.id))
			contentPages[i].port.emit('changeSymbols', params);
	for(var i=0; i < visualPages.length; i++)
		if((!visualPages[i].tab) || (visualPages[i].tab.id == tabs.activeTab.id))
			visualPages[i].port.emit('changeSymbols', params);
	kStatus = params;
	storage.currentLanguage = params.language.value;
	panel.port.emit('changeLanguage', storage.currentLanguage);
	button.badge = langsNames[params.language.value];
}

pressFuncButtonInContentPages = function(params){
	for(var i=0; i < contentPages.length; i++)
		if((!contentPages[i].tab) || (contentPages[i].tab.id == tabs.activeTab.id))
			contentPages[i].port.emit('functional', params);
}
addLetterIncontentPages = function(params){
	for(var i=0; i < contentPages.length; i++)
		if((!contentPages[i].tab) || (contentPages[i].tab.id == tabs.activeTab.id))
			contentPages[i].port.emit('addLetter', params);
}

setField = function(params){
	if(!storage.isActive)
		return;
	for(var i=0; i < visualPages.length; i++)
		if((!visualPages[i].tab) || (visualPages[i].tab.id == tabs.activeTab.id))
			visualPages[i].port.emit('setField', params);
	for(var i=0; i < contentPages.length; i++)
		if((!contentPages[i].tab) || (contentPages[i].tab.id == tabs.activeTab.id))
			contentPages[i].port.emit('changeSymbols', kStatus);
};
blurField = function(){
	for(var i=0; i < visualPages.length; i++)
		if((!visualPages[i].tab) || (visualPages[i].tab.id == tabs.activeTab.id))
			visualPages[i].port.emit('blurField');
};

pressKeyDownInVisual = function(params){
	for(var i=0; i < visualPages.length; i++)
		if((!visualPages[i].tab) || (visualPages[i].tab.id == tabs.activeTab.id))
			visualPages[i].port.emit('keyDown', params);
};
pressKeyUpInVisual = function(params){
	for(var i=0; i < visualPages.length; i++)
		if((!visualPages[i].tab) || (visualPages[i].tab.id == tabs.activeTab.id))
			visualPages[i].port.emit('keyUp', params);
}

windows.on('activate', function() {
	if(storage.isActive)
		for(var i=0; i < visualPages.length; i++)
			visualPages[i].port.emit('browserFocus');
});
windows.on('deactivate', function() {
	if(storage.isActive)
		for(var i=0; i < visualPages.length; i++)
			visualPages[i].port.emit('browserBlur');
});

tabs.on('activate', function onOpen(tab) {
	tabs.activeTab.id = tab.id;
	if(storage.isActive)
		changeSymbols(kStatus);
});

// Options
var optionPage;
pageMod.PageMod({
	include: [data.url("options/index.html"), data.url("browser-keyboard.github.io/*")],
	contentScriptFile: [data.url("include/angular.js"), data.url("options/script.js")],
	contentStyleFile: [data.url("include/paper.css"), data.url("options/style.css")],
	onAttach: function(worker){
		optionPage = this;

		if(storage.isActive){
			worker.port.emit('create', {userOptions: storage.userOptions, languageList: storage.languageList});
			worker.port.emit('changeSymbols', kStatus);
		}
		worker.port.on('reset', function(){
			resetOptions();
		});
		worker.port.on('save', function(params){
			saveOptions(params);
		});
	}
});

resetOptions = function(){
	optionPage.port.emit('setInfo', {isActive: storage.isActive, languageList: storage.languageList, userOptions: storage.userOptions});
}
saveOptions = function(params){
	if (storage.isActive)
		switchOff();

	storage.isActive = params.isActive;
	storage.languageList = params.languageList;
	storage.userOptions = params.userOptions;

	kStatus.language.count = storage.languageList.length;
	kStatus.language.value = 0;

	panel.height = (90 + 45 * (storage.languageList.length));
	panel.port.emit('languageList', storage.languageList);

	if (storage.isActive)
		switchOn();
	langsNames = createLangNamesArray();
	button.badge = langsNames[0];
}

openOptionsPage = function(){
	tabs.open(data.url("options/index.html"));
}

if(storage.isActive)
	switchOn();
