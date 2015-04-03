chrome.browserAction.setBadgeBackgroundColor({color: [62, 62, 62, 255]});

chrome.storage.local.get(["userOptions", "isActive", "languageList", "kStatus"], function(data){
  var isActive = data.isActive;
  if(isActive === undefined){
    chrome.storage.local.set({'isActive': true});
  }
  
  var userOptions = data.userOptions;
  if(userOptions === undefined){
    userOptions = {};
    userOptions.show = 'always';
    userOptions.capture = true;
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
  chrome.storage.local.set({'kStatus': kStatus});
  
});

setTimeout(function(){  
  f_updateBadgeList();
}, 12);


chrome.storage.local.get("kStatus", function(data){
});

chrome.tabs.onActivated.addListener(function(info){
  f_sendKStatusOnActivate(info.tabId);
});

chrome.tabs.onUpdated.addListener(function(info){
  f_sendKStatusOnActivate(info);
});

 
chrome.runtime.onMessage.addListener(function(data, sender){
  switch(data.eve){
    case 'changeKStutus':
      f_updateKStatus(sender.tab.id, data.kStatus);
      break;
    case 'activision':
      f_active(data.status);
      break;
    case 'to_create_child':
      chrome.tabs.sendMessage(sender.tab.id, {eve: 'to_create_child'});
      break;
    case 'to_destroy_child':
      chrome.tabs.sendMessage(sender.tab.id, {eve: 'to_destroy_child'});
      break; 
    case 'updateBadgeList':
      f_updateBadgeList();
      break;
  };
});