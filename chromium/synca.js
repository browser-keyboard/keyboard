var langNamesList;
f_updateBadgeList = function(){
  langNamesList = [];
  chrome.storage.local.get('languageList', function(data){
  for(var i=0; i < data.languageList.length; i++)
    langNamesList.push(data.languageList[i].shortName);
  f_updateBadge();
  });
};
f_updateBadge = function(){
  chrome.storage.local.get(['kStatus', 'isActive'], function(data){
		if(data.isActive)
			chrome.browserAction.setBadgeText({text: langNamesList[data.kStatus.language.value]});
		else
			chrome.browserAction.setBadgeText({text: ""});
  });
}

f_active = function(bool){  
  var isActive = bool;   
  chrome.storage.local.set({'isActive': isActive});  
  f_updateBadgeList();
  var data = {eve: "active"};  
  chrome.tabs.query({}, function(tabs) {
    for (var i=0; i<tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, data);
    }
  });
}

f_sendKStatusOnActivate = function(id){
  chrome.storage.local.get(['isActive'], function (result) {
    if(!result.isActive)
      return;
    var data = {
      eve: "kStatus"
    };    
    chrome.tabs.sendMessage(id, data);  
  });
}

f_updateKStatus = function(idTab, newStatus){
  chrome.storage.local.set({'kStatus': newStatus});
  f_updateBadge();
  data = {
    eve: 'kStatus'
  };
  chrome.tabs.query({active: true}, function(tabs) {
    for (var i=0; i<tabs.length; ++i)
      if(idTab != tabs[i].id)
	chrome.tabs.sendMessage(tabs[i].id, data);
  });
}

f_changeLanguage = function(num){
  chrome.storage.local.get(['kStatus', 'isActive'], function (result) {
    var kStatus = result.kStatus;
    kStatus.language.value = num;
    chrome.storage.local.set({'kStatus': kStatus});
    if(!result.isActive)
      return;
    var data = {
      eve: "kStatus"
    };    
    chrome.tabs.query({active: true}, function(tabs) {
      for (var i=0; i<tabs.length; ++i)
	  chrome.tabs.sendMessage(tabs[i].id, data);
    });
    f_updateBadgeList();
    f_updateBadge();
  });
}

