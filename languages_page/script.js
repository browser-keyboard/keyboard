angular.module('optionApp', [])
  .controller('OptionController', ['$scope', '$http', function($scope, $http) {
    var layoutsFromServer;
    $http.get('languages.json').success(function(data){
      layoutsFromServer = data;
      $scope.reset();
    });
    var layoutsIdUsed = [1, 2];
    
    var sortByShortName = function(a,b) {
      if (a.shortName < b.shortName)
	return -1;
	  if (a.shortName > b.shortName)
	    return 1;
	return 0;
    }
    $scope.reset = function(){
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
    $scope.save = function(){
      $scope.layoutsUsed.sort(function(a,b) {
	if (a.order < b.order)
	  return -1;
	    if (a.order > b.order)
	      return 1;
	return 0;	
      });
      
      var toSave = [];
      for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
	$http.get('languages/' + $scope.layoutsUsed[i].id + '.json')
	  .success(function(data){
	    console.log(data);
	  });
      }
      
    }
}]);

