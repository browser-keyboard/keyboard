var langNamesList;

f_active = function(isActive){
  if (!isActive)
    f_nullKStatus();
  chrome.storage.local.set({'isActive': isActive});
	chrome.runtime.sendMessage({eve: "updateBadgeList"});
  var data = {eve: "active", isActive: isActive};
  chrome.tabs.query({}, function(tabs) {
    for (var i=0; i<tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, data);
    }
  });
}

f_nullKStatus = function(){
  chrome.storage.local.get(['kStatus'], function (result) {
      var kStatus = result.kStatus;
      kStatus.shift.active = false;
      kStatus.shift.physical = false;
      kStatus.caps.active = false;
      kStatus.addit.active = false;
      kStatus.addit.physical = false;
      kStatus.additLong.active = false;
      chrome.storage.local.set({'kStatus': kStatus});
    });
}

f_sendKStatusOnActivate = function(id){
  chrome.storage.local.get(['isActive'], function (result) {
    if(!result.isActive)
      return;
    var data = {
      eve: "changeKStatus"
    };
    chrome.tabs.sendMessage(id, data);
  });
}

f_updateKStatus = function(idTab, newStatus){
  chrome.storage.local.set({'kStatus': newStatus});
	chrome.runtime.sendMessage({eve: "updateBadge"});
  data = {
    eve: "changeKStatus"
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
      eve: "changeKStatus"
    };
    chrome.tabs.query({active: true}, function(tabs) {
      for (var i=0; i<tabs.length; ++i)
        chrome.tabs.sendMessage(tabs[i].id, data);
    });
		chrome.runtime.sendMessage({eve: "updateBadgeList"});
  });
}
