//	подключение api браузера для рассширения
var ss = require("sdk/simple-storage");
var array = require('sdk/util/array');
var data = require("sdk/self").data;
var { ToggleButton } = require('sdk/ui/button/toggle');
var pageMod = require("sdk/page-mod");

//	восстановление настройкей клавиатуры из storage: текуший язык, видимость и активность
var currentLanguage = ss.storage.currentLanguage ? ss.storage.currentLanguage : 0;
ss.storage.currentLanguage = currentLanguage;
var showing = ss.storage.showing ? ss.storage.showing : true;
ss.storage.showing = showing;
var active = ss.storage.active ? ss.storage.active : true;
ss.storage.active = active;

var currentTab;
//	состояние функциональных клавиш
var currentKStatus = {
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
  }   		
};

    
// горячая клавиша для влючения/отключения клавиатуры
var { Hotkey } = require("sdk/hotkeys");
var hotKeyToActivate = Hotkey({
  combo: "accel-k",
  onPress: function() {
    factivision(!active);
  }
});

//	кнопка и панель на адрес баре браузера
var button = ToggleButton({
  id: "style-tab",
  label: "Style Tab",
  icon: "./icon-16.png",  
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
  width: 200,
  height: 180
});
function handleHide() {
  button.state('window', {checked: false});
}
panel.port.on('changeLanguage', function(params){
  ss.storage.currentLanguage = params;
  fChangeLanguage(params);
});
panel.port.on('showing', function(params){
  ss.storage.showing = params;
  fShowing(params);
});
panel.port.on('activision', function(params){
  factivision(params);
});
panel.port.emit('changeLanguage', currentLanguage);
panel.port.emit('showing', showing);
panel.port.emit('activision', active);





var fSetField, fkeyDown, fkeyUp, fBrowserBlur, fBrowserFocus, fTopChangeLanguage; // functions 
var fKeyDownToFrame, fSimpleEnter, fShiftEnter, fDeleting, fBackspacing, fAddLetter;

// 	логика изменения состояния и визуальная часть
var topPages = [];
pageMod.PageMod({
  include: "*",
  attachTo: ["top"],
  contentScriptWhen: 'ready',
  contentScriptFile: [data.url("libs/jquery.js"), data.url("objects.js"), data.url("libs/jquery-ui.js"), data.url("visual/scripts/Key.js"), 
    data.url("visual/scripts/KeyboardLogic.js"), data.url("visual/scripts/KeyboardVisual.js"), data.url("visual/scripts/KeyVisual.js"),
    data.url("visual/scripts/Keyboard.js"), data.url("visual/scripts/connect.js") ],
  contentStyleFile: data.url("visual/css/style.css"),
  onAttach: function(worker){
		  
  array.add(topPages, worker);
  worker.on('pageshow', function() { array.add(topPages, this); });
  worker.on('pagehide', function() { array.remove(topPages, this); });
  worker.on('detach', function() { array.remove(topPages, this); })
  
  worker.port.emit('changeLanguage', currentLanguage);
  worker.port.emit('changeSymbols', currentKStatus);
  worker.port.emit('showing', showing);
				  
  worker.port.on('changeSymbols', function(params){
    fChangeSymbols(params);
  });
  worker.port.on('changeLanguage', function(params){
    ss.storage.currentLanguage = params;
    fChangeLanguage(params);
  });
  worker.port.on('showing', function(params){
    ss.storage.showing = params;
    fShowing(params);
  });
  worker.port.on('activision', function(params){
    ss.storage.active = params;
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
var workers = [];
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
    
    worker.port.emit('activision', active);

    worker.port.emit('changeLanguage', currentLanguage);
    worker.port.emit('changeSymbols', currentKStatus);
    worker.port.on('setField', function(params){
      fSetField(params);
    });	
    worker.port.on('changeSymbols', function(params){
      console.log('main.js called by changeSymbols', params );
      fChangeSymbols(params);
    });
    worker.port.on('blurField', function(){
      fBlurField();
    });
    worker.port.on('KeyFunctionalVisual', function(params){
      fKeyFunctionalVisual(params);
    });
    worker.port.on('KeyDown', function(params){
      fKeyDown(params);
    });
    worker.port.on('KeyUp', function(params){
      fKeyUp(params);
    });
}
});

//	включает/отключает клавиатуры
factivision = function(params){
  active = params;
  panel.port.emit('activision', params);
  for(var i=0; i < workers.length; i++)
    workers[i].port.emit('activision', params);
  var isToShow = active && showing;
  for(var i=0; i < topPages.length; i++){
    topPages[i].port.emit('showing', isToShow);
  }
  ss.storage.active = active;
}

// меняет символы
fChangeSymbols = function(params){
  console.log('main.js fChangeSymbols', params );
  for(var i=0; i < workers.length; i++){
    if(workers[i].tab.id == currentTab){
      workers[i].port.emit('changeSymbols', params);
      console.log('1e');
    }
  }
  for(var i=0; i < topPages.length; i++)
    if(topPages[i].tab.id == currentTab){
      topPages[i].port.emit('changeSymbols', params);
      console.log('2e');
    }
  currentKStatus = params;
}
// меняет язык
fChangeLanguage = function(params){
  currentLanguage = params;
  panel.port.emit('changeLanguage', params);
  for(var i=0; i < workers.length; i++){
    if(workers[i].tab.id == currentTab)
      workers[i].port.emit('changeLanguage', params);
  }
  for(var i=0; i < topPages.length; i++)
    if(topPages[i].tab.id == currentTab)
      topPages[i].port.emit('changeLanguage', params);
  ss.storage.currentLanguage = currentLanguage;
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




	
	/***/
	
fShowing = function(params){
  showing = params;
  ss.storage.showing = showing;
  if(!active)
    return;
  for(var i=0; i < topPages.length; i++)
    topPages[i].port.emit('showing', params);
  panel.port.emit('showing', params);
};

fSetField = function(params){
  for(var i=0; i < topPages.length; i++)
    if(topPages[i].tab.id == currentTab)
      topPages[i].port.emit('setField', params);
  for(var i=0; i < workers.length; i++)
    if(workers[i].tab.id == currentTab){
      workers[i].port.emit('changeLanguage', currentLanguage);
      workers[i].port.emit('changeSymbols', currentKStatus);
    }
};
fBlurField = function(){
  for(var i=0; i < topPages.length; i++)
    if(topPages[i].tab.id == currentTab)
      topPages[i].port.emit('blurField');
};

fKeyFunctionalVisual = function(params){
  for(var i=0; i < topPages.length; i++)
    if(topPages[i].tab.id == currentTab)
      topPages[i].port.emit('KeyFunctionalVisual', params);
}
fKeyDown = function(params){
  for(var i=0; i < topPages.length; i++)
    if(topPages[i].tab.id == currentTab)
      topPages[i].port.emit('keyDown', params);			
}
fKeyUp = function(params){
  for(var i=0; i < topPages.length; i++)
    if(topPages[i].tab.id == currentTab)
      topPages[i].port.emit('keyUp', params);
}


var windows = require("sdk/windows").browserWindows;

windows.on('activate', function() {
  for(var i=0; i < topPages.length; i++){
    topPages[i].port.emit('browserFocus');
  }
});
windows.on('deactivate', function() {
  for(var i=0; i < topPages.length; i++){
    topPages[i].port.emit('browserBlur');
}
});

var tabs = require("sdk/tabs");

// Listen for tab openings.
tabs.on('activate', function onOpen(tab) {
  currentTab = tab.id;
  fChangeLanguage(currentLanguage);
	console.log('currentTab', currentTab);
});


// Глобальные настройки раскладок
pageMod.PageMod({
  include: data.url("options/index.html")
});
tabs.open(data.url("options/index.html"));
