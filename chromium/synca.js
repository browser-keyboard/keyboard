var langNamesList;
f_updateBadgeList = function(){
  langNamesList = [];
  chrome.storage.local.get('languageList', function(data){
  for(var i=0; i < data.languageList.length; i++)
    langNamesList.push(data.languageList[i].shortName);
  chrome.browserAction.setBadgeText({text: langNamesList[0]});
  });
};
f_updateBadge = function(){
  chrome.storage.local.get('kStatus', function(data){
    chrome.browserAction.setBadgeText({text: langNamesList[data.kStatus.language.value]});
  });
}

f_active = function(bool){  
  var isActive = bool;   
  chrome.storage.local.set({'isActive': isActive});  
  var data = {eve: "active"}
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

