angular.module('optionApp', [])
  .controller('OptionController', ['$scope', '$http', function($scope, $http) {  
    
    // functions
    var sortByShortName = function(a,b) {
      if (a.shortName < b.shortName)
	return -1;
	  if (a.shortName > b.shortName)
	    return 1;
	return 0;
    }
    
    $scope.reset = function(){
      $scope.alertLangCount = false;
      var layoutsFromServer;
      var layoutsIdUsed = [];
      
      chrome.storage.local.get(['languageList', 'isActive', 'userOptions'], function (result) {
	$scope.isActive = result.isActive;
	$scope.userOptions = {};
	$scope.userOptions.capture = result.userOptions.capture;
	$scope.userOptions.show = result.userOptions.show;
	$scope.userOptions.langToSave = result.userOptions.langToSave;
	
	for(var i = 0; i < result.languageList.length; i++){
	  layoutsIdUsed.push(result.languageList[i].id);
	  
	  $http.get('http://browser-keyboard.github.io/languages/list.json').success(function(data){
	    layoutsFromServer = data;
	    $scope.layoutsAll = [];
	    $scope.searchEnable = '';
	    $scope.toUseLength = 0;
	    angular.forEach(layoutsFromServer, function(layout) {
	      var a = layoutsIdUsed.indexOf(layout.id);
	      layout.order = a+1;
	      layout.toUse = (a != -1);
	      $scope.layoutsAll.push(layout);
	      if(a != -1){
		$scope.toUseLength++;
	      }
	    });
	    
	    $scope.selectedIdEneble = -1;
	    $scope.layoutsEnable = -1; 
	  }).error(function(){
	    console.log('ошибка');
	  });
	}
      });
    }
    $scope.alertLangCountClose = function(){
      $scope.alertLangCount = false;
    }
    
    $scope.addToUsed = function(){
      if($scope.selectedIdEneble == -1)
	return;
      for (var i = 0, len = $scope.layoutsAll.length; i < len; i++)
	if($scope.layoutsAll[i].id == $scope.selectedIdEneble){
	  $scope.layoutsAll[i].toUse = true;
	  $scope.toUseLength++;
	  $scope.layoutsAll[i].order = $scope.toUseLength;
	}
      a = -1;
      for (var i = 0, len = $scope.layoutsEnable.length; i < len; i++) {
	if($scope.layoutsEnable[i].id == $scope.selectedIdEneble)
	  a = i;
      };
      var len = $scope.layoutsEnable.length - 1;
      a++;
      a = (a < len+1) ? a : len - 1;
      $scope.selectedIdEneble = (a == -1) ? -1 : $scope.layoutsEnable[a].id;
    };
    
    $scope.removeFromUsed = function(){
      if($scope.selectedIdUsed == -1)
	return;
      for (var i = 0, len = $scope.layoutsAll.length; i < len; i++)
	if($scope.layoutsAll[i].id == $scope.selectedIdUsed){
	  $scope.layoutsAll[i].toUse = false;
	  var order = $scope.layoutsAll[i].order;
	  delete $scope.layoutsAll[i].order;
	  $scope.toUseLength--;
	}      
      switch($scope.layoutsUsed.length) {
	case 0:
	  $scope.selectedIdUsed = -1;
	  break;
	case order:
	  for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
	    if($scope.layoutsUsed[i].order+1 ==  order)
	      $scope.selectedIdUsed = $scope.layoutsUsed[i].id;
	  }	
	  break;
	default:
	  for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
	    if($scope.layoutsUsed[i].order > order){
	      $scope.layoutsUsed[i].order = $scope.layoutsUsed[i].order - 1;
	      if($scope.layoutsUsed[i].order ==  order)
		$scope.selectedIdUsed = $scope.layoutsUsed[i].id;
	    }
	  }	
      }
    };
    
    $scope.orderUp = function(){
      if($scope.selectedIdUsed == -1)
	return;
      for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
	if($scope.layoutsUsed[i].id == $scope.selectedIdUsed)
	  a = i;
      }
      var order = $scope.layoutsUsed[a].order;
      if(order == 1)
	return;
      
      for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
	if($scope.layoutsUsed[i].order == order - 1)
	  b = i;
      }
      var objectC = $scope.layoutsUsed[a];
      $scope.layoutsUsed[a] = $scope.layoutsUsed[b];
      $scope.layoutsUsed[b] = objectC;
      
      $scope.layoutsUsed[a].order = order ;
      $scope.layoutsUsed[b].order = order - 1;
    };
    
    $scope.orderDown = function(){
      if($scope.selectedIdUsed == -1)
	return;
      for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
	if($scope.layoutsUsed[i].id == $scope.selectedIdUsed)
	  a = i;
      }
      var order = $scope.layoutsUsed[a].order;
      if(order == $scope.layoutsUsed.length)
	return;
      
      for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
	if($scope.layoutsUsed[i].order == order + 1)
	  b = i;
      }
      
      var objectC = $scope.layoutsUsed[a];
      $scope.layoutsUsed[a] = $scope.layoutsUsed[b];
      $scope.layoutsUsed[b] = objectC;
      
      $scope.layoutsUsed[a].order = order;
      $scope.layoutsUsed[b].order = order + 1;
    };
    
    
    /*********************      SAVE         *********************************/
    
	$scope.save = function(){
		if($scope.layoutsUsed.length == 0){
			$scope.alertLangCount = true;
			return;
		}else
			$scope.alertLangCount = false;
		
		$scope.layoutsUsed.sort(function(a,b) {
			if (a.order < b.order)
				return -1;
					if (a.order > b.order)
						return 1;
			return 0;	
		});
		
		var toSave = [];
		var saveBool = true;
		for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
			$http.get('http://browser-keyboard.github.io/languages/' + $scope.layoutsUsed[i].id + '.json')
				.success(function(data){
					toSave.push(data);
				});
		};
		
		setInterval(function(){
			if(!saveBool || (toSave.length != $scope.layoutsUsed.length))
				return;
			chrome.storage.local.get('kStatus', function(data){
				var kStatus = data.kStatus;
				kStatus.language.count = toSave.length;
				kStatus.language.value = 0;
				
				chrome.storage.local.set({'languageList': toSave, 'kStatus': kStatus, userOptions: $scope.userOptions});
				chrome.runtime.sendMessage({eve: "updateBadgeList"});
				data = {
					eve: "rebult",
					kStatus: kStatus,
					userOptions: $scope.userOptions
				}
				chrome.tabs.query({}, function(tabs) {
					for (var i=0; i<tabs.length; ++i)
						chrome.tabs.sendMessage(tabs[i].id, data);
				});
			});
			saveBool = false;
		}, 120);	
		
		f_active($scope.isActive);
	}
  
  
  $scope.reset(); 
}]);

