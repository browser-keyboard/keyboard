
f_udpateBAImage = function(text){
	var myCanvas = document.getElementById('image');
	var context = myCanvas.getContext('2d');
	if(text == ''){
		context.clearRect(0, 0, 19, 19);
		var img = new Image();
		img.src = '../icons/19.png';
		img.onload = function(){
			context.drawImage(img, 0, 0, 19, 19);
			chrome.browserAction.setIcon({ imageData: context.getImageData(0, 0, 19, 19) });	
		};
	}else{
		context.clearRect(0, 0, 19, 19);
		context.fillStyle = "black";
		context.font = "normal 15px Arial";
		context.fillText(text, 1, 18);
		chrome.browserAction.setIcon({ imageData: context.getImageData(0, 0, 19, 19) });	
	}	
}

f_updateBadge = function(){
  chrome.storage.local.get(['kStatus', 'isActive'], function(data){
		if(data.isActive)
			f_udpateBAImage( langNamesList[data.kStatus.language.value]);
		else
			f_udpateBAImage("");
  });
}
f_updateBadgeList = function(){
  langNamesList = [];
  chrome.storage.local.get('languageList', function(data){
  for(var i=0; i < data.languageList.length; i++)
    langNamesList.push(data.languageList[i].shortName);
  f_updateBadge();
  });
};