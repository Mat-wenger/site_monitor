exports.helpers = [];

exports.init = function(helperStack){
	var helpersTemp = {};
	var helperName;
	for(var i = 0; i< helperStack.length; i++){
		try{
			helperName = helperStack[i]+'Helper';
			var tempReturn = require('Helpers/' + helperStack[i]);
			helpersTemp[helperName] = tempReturn;	
		}
		catch(e){
			console.log('could not find helper ' + helperStack[i]);
		}
		/*
		if(helpersTemp[helperName] == undefined){
			try{
				Ti.API.log(helperName);
				var tempReturn = require('Helpers/' + helperName);
				Ti.API.log(tempReturn);
				helptersTemp[helperName] = tempReturn;
			}
			catch(e){
				console.log('Still could not find helper ' + helperStack[i]);	
			}
		}
		*/		
	}
	return helpersTemp;
};

