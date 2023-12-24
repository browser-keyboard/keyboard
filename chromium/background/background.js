chrome.browserAction.setBadgeBackgroundColor({color: [62, 62, 62, 255]});

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

async function defaultOptionsOnFirstInstalling() {
  if (!localStorage.getItem('was_installed')){
    languageList = [];
    
    var localLanguageList = await new Promise(function(resolve, reject) {
      chrome.i18n.getAcceptLanguages(function (localLanguageList) {
        resolve(localLanguageList);
      });
    });
    
    const lang = await Promise.all(localLanguageList.map((localLanguage) => 
      fetch('chrome-extension://' + chrome.runtime.id + '/content/languages/' + localLanguage + '.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (language) {
        languageList.push(language);
      })
      .catch(function (error) {
      })
    ));


    alert(languageList);
    chrome.storage.local.set({'languageList': languageList});
    
    chrome.storage.local.set({'isActive': true});
    
    userOptions = {};
    userOptions.show = 'on-active';
    userOptions.capture = true;
    userOptions.langToSave = true;
    userOptions.size = "2x";
    userOptions.color = "white";
    chrome.storage.local.set({'userOptions': userOptions});
    
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
    kStatus.language.count = languageList.length;
    chrome.storage.local.set({'kStatus': kStatus});
    f_updateBadgeList();
    f_active(true);
    localStorage.setItem('was_installed', true);
  }
}
defaultOptionsOnFirstInstalling();

chrome.commands.onCommand.addListener(function(command) {
	if(command == "toggle-feature-activision"){
		chrome.storage.local.get(["isActive"], function(data){
			f_active(!data.isActive);
		});
	}
});
