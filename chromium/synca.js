f_active = function(bool){  
  var isActive = bool;   
  var data = {eve: "active", status: isActive}
  chrome.storage.local.set({'isActive': isActive}, function() {});  
  chrome.tabs.query({}, function(tabs) {
    for (var i=0; i<tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, data);
    }
  });
}

f_showen = function(bool){  
  var isShow = bool;   
  chrome.storage.local.set({'isShow': isShow}, function() {});  
  chrome.storage.local.get('isActive', function (result) {
    if(!result.isActive)
      return;
    var data = {eve: "showen", status: isShow}
    chrome.tabs.query({}, function(tabs) {
      for (var i=0; i<tabs.length; ++i)
	  chrome.tabs.sendMessage(tabs[i].id, data);
    });
  }); 
  
}

f_sendKStatusOnActivate = function(id){
  chrome.storage.local.get(['kStatus', 'isActive'], function (result) {
    if(!result.isActive)
      return;
    var data = {
      eve: "kStatus",
      kStatus:  result.kStatus
    };    
    chrome.tabs.sendMessage(id, data);  
  });
}

f_updateKStatus = function(idTab, newStatus){
  chrome.storage.local.set({'kStatus': newStatus}, function() {});
  data = {
    eve: 'kStatus',
    kStatus: newStatus
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
    chrome.storage.local.set({'kStatus': kStatus}, function(){});
    if(!result.isActive)
      return;
    var data = {
      eve: "kStatus",
      kStatus:  kStatus
    };    
    chrome.tabs.query({active: true}, function(tabs) {
      for (var i=0; i<tabs.length; ++i)
	  chrome.tabs.sendMessage(tabs[i].id, data);
    });
  });
}