 var currentTab;
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
    count: 2
  }
};

 chrome.tabs.onActivated.addListener(function(info){
  console.log('tabActivate');
  currentTab = info.tabId;
  var data = {
    eve: "tabActivate",
    kStatus: kStatus
  };  
  chrome.tabs.sendMessage(currentTab, data);
});

 chrome.tabs.onUpdated.addListener(function(info){
  console.log('pageCreate');
  var data = {
    eve: "create",
    kStatus: kStatus
  };
  
  chrome.tabs.sendMessage(info, data);
});

 
chrome.runtime.onMessage.addListener(function(data){
  switch(data.eve){
    case 'changeKStutus':
      kStatus = data.kStatus;
      break;
  };
})

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 /*
 
 
 
 chrome.tabs.query({}, function(tabs) {
    var message = {foo: bar};
    for (var i=0; i<tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, message);
    }
});


*/