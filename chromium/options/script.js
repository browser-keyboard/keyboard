angular.module('optionApp', [])
	.controller('OptionController', ['$scope', '$http', '$document', function($scope, $http, $document) {

		// sorting functions
		var sortByShortName = function(a,b) {
			if (a.shortName < b.shortName)
				return -1;
			if (a.shortName > b.shortName)
				return 1;
			return 0;
		}

		var sortByOrder = function(a,b) {
			if (a.order < b.order)
				return -1;
			if (a.order > b.order)
				return 1;
			return 0;
		}

		/*********************      RESET        *********************************/
		$scope.reset = function(){
			$scope.alertLangCount = "hided";
			$scope.alertShowSaved = "hided";
			$scope.alertNotNetOnReset = "hided";
			$scope.alertNotNetOnSave = "hided";
			$scope.netConnected = false;
			var layoutsFromServer;
			var layoutsIdUsed = [];
			$scope.selectedIdUsed = -1;
			$scope.selectedIdEneble = -1;

			chrome.storage.local.get(['languageList', 'isActive', 'userOptions'], function (result) {
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
							if(a != -1)
								$scope.toUseLength++;
						});

						$scope.selectedIdEneble = -1;
						$scope.layoutsEnable = -1;
					}).error(function(){
						$scope.alertNotNetOnReset = "showed";
					});
				}
			});
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
			var a = -1;
			for (var i = 0, len = $scope.layoutsEnable.length; i < len; i++)
				if($scope.layoutsEnable[i].id == $scope.selectedIdEneble)
					a = i;

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
			for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++)
				if($scope.layoutsUsed[i].id == $scope.selectedIdUsed)
					a = i;

			var order = $scope.layoutsUsed[a].order;
			if(order == 1)
				return;

			for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++)
				if($scope.layoutsUsed[i].order == order - 1)
					b = i;

			var objectC = $scope.layoutsUsed[a];
			$scope.layoutsUsed[a] = $scope.layoutsUsed[b];
			$scope.layoutsUsed[b] = objectC;

			$scope.layoutsUsed[a].order = order ;
			$scope.layoutsUsed[b].order = order - 1;
		};

		$scope.orderDown = function(){
			if($scope.selectedIdUsed == -1)
				return;
			for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++)
				if($scope.layoutsUsed[i].id == $scope.selectedIdUsed)
					a = i;

			var order = $scope.layoutsUsed[a].order;
			if(order == $scope.layoutsUsed.length)
				return;

			for (var i = 0, len = $scope.layoutsUsed.length; i < len; i++)
				if($scope.layoutsUsed[i].order == order + 1)
					b = i;

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

			$scope.layoutsUsed.sort(sortByOrder);

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

		var interval = setInterval(function(){
			if(!saveBool)
				return;
			if($scope.netConnected)
				if(toSave.length != $scope.layoutsUsed.length)
					return;
			chrome.storage.local.get('kStatus', function(data){
				if($scope.netConnected){
					var kStatus = data.kStatus;
					kStatus.language.count = toSave.length;
					kStatus.language.value = 0;

					chrome.storage.local.set({'languageList': toSave, 'kStatus': kStatus});
					chrome.runtime.sendMessage({eve: "updateBadgeList"});
				}
				chrome.storage.local.set({userOptions: $scope.userOptions});
				if($scope.isActive){
						data = {
						eve: "rebult"
					}
				}
				chrome.tabs.query({}, function(tabs) {
					for (var i=0; i<tabs.length; ++i)
						chrome.tabs.sendMessage(tabs[i].id, data);
				});
			});

			clearInterval(interval);
			saveBool = false;
			$scope.alertNotNetOnSave = "hided";
			$scope.alertShowSaved = "showed";
			setTimeout(function(){
				$scope.canHideAlertShowSaved = true;
			}, 300);
		}, 120);

		f_active($scope.isActive);
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

	$scope.getTitle = function(){
		return chrome.i18n.getMessage("options");
	}

		/*********************      LOCALE         *********************************/
	$scope.localeLoad = function(){
		$scope.locale = {};
		$document[0].title = chrome.i18n.getMessage("options");

		$scope.locale.alert_not_net_on_reset = chrome.i18n.getMessage("alert_not_net_on_reset");
		$scope.locale.alert_on_lang_count = chrome.i18n.getMessage("alert_on_lang_count");
		$scope.locale.alert_not_net_on_save = chrome.i18n.getMessage("alert_not_net_on_save");
		$scope.locale.main_options = chrome.i18n.getMessage("main_options");
		$scope.locale.option_active = chrome.i18n.getMessage("option_active");
		$scope.locale.option_capture = chrome.i18n.getMessage("option_capture");
		$scope.locale.option_langToSave = chrome.i18n.getMessage("option_langToSave");
		$scope.locale.onsreen_keyboard_behavior = chrome.i18n.getMessage("onsreen_keyboard_behavior");
		$scope.locale.show_always = chrome.i18n.getMessage("show_always");
		$scope.locale.show_onactive = chrome.i18n.getMessage("show_onactive");
		$scope.locale.show_newer = chrome.i18n.getMessage("show_newer");
		$scope.locale.onsreen_color_sceme = chrome.i18n.getMessage("onsreen_color_sceme");
		$scope.locale.onsreen_color_white = chrome.i18n.getMessage("onsreen_color_white");
		$scope.locale.onsreen_color_black = chrome.i18n.getMessage("onsreen_color_black");
		$scope.locale.onsreen_size = chrome.i18n.getMessage("onsreen_size");
		$scope.locale.onsreen_size_normal = chrome.i18n.getMessage("onsreen_size_normal");
		$scope.locale.onsreen_size_big = chrome.i18n.getMessage("onsreen_size_big");
		$scope.locale.onsreen_size_large = chrome.i18n.getMessage("onsreen_size_large");
		$scope.locale.language_options = chrome.i18n.getMessage("language_options");
		$scope.locale.languages_enable = chrome.i18n.getMessage("languages_enable");
		$scope.locale.language_selected = chrome.i18n.getMessage("language_selected");
		$scope.locale.search_placehold = chrome.i18n.getMessage("search_placehold");
		$scope.locale.cancel_button = chrome.i18n.getMessage("cancel_button");
		$scope.locale.save_button = chrome.i18n.getMessage("save_button");
	}
	$scope.localeLoad();


	/*********************      $scope.reset()         *********************************/
	$scope.reset();
}]);
