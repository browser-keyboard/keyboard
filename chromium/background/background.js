chrome.browserAction.setBadgeBackgroundColor({color: [62, 62, 62, 255]});

chrome.storage.local.get(["userOptions", "isActive", "languageList", "kStatus" ], function(data){
  var isActive = data.isActive;
  if(isActive === undefined){
    chrome.storage.local.set({'isActive': true});
  }

  var userOptions = data.userOptions;
  if(userOptions === undefined){
    userOptions = {};
    userOptions.show = 'always';
    userOptions.capture = true;
    userOptions.langToSave = true;
    userOptions.size = "standart";
    userOptions.color = "white";
    chrome.storage.local.set({'userOptions': userOptions});
  }

  languageList = data.languageList;
  if((languageList === undefined) || (!languageList[0])){
    languageList = [ENGISHLAYOUT];
    chrome.storage.local.set({'languageList': languageList});
  }

  var kStatus = data.kStatus;
  if(kStatus === undefined){
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
  }
  kStatus.language.count = languageList.length;
  if(!userOptions.langToSave)
		kStatus.language.value = 0;
  chrome.storage.local.set({'kStatus': kStatus});
  f_updateBadgeList();
});

chrome.tabs.onActivated.addListener(function(info){
  f_sendKStatusOnActivate(info.tabId);
});

chrome.tabs.onUpdated.addListener(function(info){
  f_sendKStatusOnActivate(info);
});

chrome.runtime.onMessage.addListener(function(data, sender){
  switch(data.eve){
    case 'changeKStatus':
      if(sender.tab)
        f_updateKStatus(sender.tab.id, data.kStatus);
      break;
    case 'activision':
      f_active(data.status);
      break;
    case 'to_destroy_child':
      chrome.tabs.sendMessage(sender.tab.id, {eve: 'to_destroy_child'});
      break;
    case 'updateBadgeList':
      f_updateBadgeList();
      break;
    case 'updateBadge':
      f_updateBadge();
      break;
  };
});

function openOptionsOnFirstInstalling() {
    if (!localStorage.getItem('was_installed')){
      localStorage.setItem('was_installed', true);
      chrome.tabs.create({ "url": "chrome-extension://" + chrome.runtime.id + "/options/index.html"});
      f_active(true);
    }
}
setTimeout(openOptionsOnFirstInstalling, 500);

chrome.commands.onCommand.addListener(function(command) {
	if(command == "toggle-feature-activision"){
		chrome.storage.local.get(["isActive"], function(data){
			f_active(!data.isActive);
		});
	}
});
