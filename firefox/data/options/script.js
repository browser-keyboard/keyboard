angular.module('optionApp', [])
  .controller('OptionController', ['$scope', '$http', '$document', function($scope, $http, $document) {

    // functions
    var sortByShortName = function(a,b) {
      if (a.shortName < b.shortName)
	return -1;
	  if (a.shortName > b.shortName)
	    return 1;
	return 0;
    }

    /*********************      RESET        *********************************/



		var layoutsFromServer;
		var layoutsIdUsed = [];
    $scope.reset = function(){
      $scope.alertLangCount = "hided";
			$scope.alertShowSaved = "hided";
			$scope.alertNotNetOnReset = "hided";
			$scope.alertNotNetOnSave = "hided";
			$scope.netConnected = false;
			$scope.selectedIdUsed = -1;
			$scope.selectedIdEneble = -1;
			self.port.emit('reset');
			self.port.on('setInfo', function (params) { // Addon SDK API
				$scope.setInfo(params);
			});

		}

    $scope.setInfo = function(result){
			$scope.isActive = result.isActive;
			$scope.userOptions = {};
			$scope.userOptions.capture = result.userOptions.capture;
			$scope.userOptions.show = result.userOptions.show;
			$scope.userOptions.langToSave = result.userOptions.langToSave;
			$scope.userOptions.size = result.userOptions.size;
			$scope.userOptions.color = result.userOptions.color;

			for(var i = 0; i < result.languageList.length; i++){
				layoutsIdUsed.push(result.languageList[i].id);

				$http.get('http://browser-keyboard.github.io/languages/list.json').success(function(data){
					$scope.netConnected = true;
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
					$scope.alertNotNetOnReset = "showed";
				});
			}
		}

    /*********************      ADD TO USE         *********************************/
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

    /*********************      REMOVE FROM USED         *********************************/
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
	case 1:
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

    /*********************      ORDER         *********************************/
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
		var saveBool = true;

		if($scope.netConnected){
			if($scope.layoutsUsed.length == 0){
				$scope.alertLangCount = "showed";
				return;
			}else
				$scope.alertLangCount = "hided";

			$scope.layoutsUsed.sort(function(a,b) {
				if (a.order < b.order)
					return -1;
						if (a.order > b.order)
							return 1;
				return 0;
			});

			var toSave = [];
			for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++) {
				$http.get('http://browser-keyboard.github.io/languages/' + $scope.layoutsUsed[i].id + '.json')
					.success(function(data){
						toSave.push(data);
					}).error(function(){
						$scope.alertNotNetOnSave = "showen";
						saveBool = false;
					});
			};
		}

		setInterval(function(){
			if(!saveBool)
				return;
			if($scope.netConnected)
				if(toSave.length != $scope.layoutsUsed.length)
					return;
			self.port.emit("save", {languageList: toSave, isActive: $scope.isActive, userOptions: $scope.userOptions});
			saveBool = false;
			$scope.alertNotNetOnSave = "hided";
			$scope.alertShowSaved = "showed";
			setTimeout(function(){
				$scope.canHideAlertShowSaved = true;
			}, 300);
		}, 120);
	}

    /*********************      ALERTS         *********************************/

  $scope.$watch(function() {
		if($scope.canHideAlertShowSaved){
			$scope.alertShowSaved = "hided";
		}
  });
	$scope.alertShowSavedClose = function(){
		$scope.alertShowSaved = "hided";
	}
	$scope.alertLangCountClose = function(){
		$scope.alertLangCount = "hided";
	}

  $scope.reset();
}]);
