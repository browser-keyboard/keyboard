chrome.storage.local.get("isActive", function(data){
  var isActive = data.isActive;
  if(isActive === undefined){
    chrome.storage.local.set({'isActive': true}, function(){
      console.log("x-frame saved");      
    });
  }
});


chrome.storage.local.get("isShow", function(data){
  var isShow = data.isShow;
  if(isShow === undefined){
    chrome.storage.local.set({'isShow': true}, function(){});
  }
});

var langNamesList;
chrome.storage.local.get("languageList", function(data){
  languageList = data.languageList;
  if(languageList === undefined){
    languageList = [ENGISHLAYOUT];    
    chrome.storage.local.set({'languageList': languageList}, function(){});
  }
});

function updateLangList(arr){
  langNamesList = [];
  for(var i=0; i < arr.length; i++)
    langNamesList.push(arr[i].shortName);
};

chrome.storage.local.get("kStatus", function(data){
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
	value: 0,
	count: 1
      }
    };
    chrome.storage.local.set({'kStatus': kStatus}, function(){});
  }
});

chrome.tabs.onActivated.addListener(function(info){
  f_sendKStatusOnActivate(info.tabId);
  console.log('banana');
});

chrome.tabs.onUpdated.addListener(function(info){
  f_sendKStatusOnActivate(info);
  console.log('yea');
});

 
chrome.runtime.onMessage.addListener(function(data, sender){
  switch(data.eve){
    case 'changeKStutus':
//       chrome.storage.local.set({'kStatus': data.kStatus}, function() {});
      f_updateKStatus(sender.tab.id, data.kStatus);
      break;
    case 'activision':
      f_activision(data.status);
      break;
    case 'showing':
      f_showen(data.status);
      break;
    case 'to_create_child':
      chrome.tabs.sendMessage(sender.tab.id, {eve: 'to_create_child'});
      break;
    case 'to_destroy_child':
      chrome.tabs.sendMessage(sender.tab.id, {eve: 'to_destroy_child'});
      break;
    
  };
});