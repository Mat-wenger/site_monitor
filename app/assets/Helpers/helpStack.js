exports.helpers = [];
exports.debug = false;

exports.init = function(helperStack){
	var helpersTemp = {};
	var helperName;
	var tempReturn = {};
	for(var i = 0; i< helperStack.length; i++){
		tempReturn = {};
		helperName = helperStack[i];
		if(helperStack[i].indexOf('Helper') == -1)
			helperName += "Helper";	
		try{
			if(this.debug)
				Ti.API.log('Trying to find the helper [[ ' + helperName + ']].');
			var tempReturn = require('Helpers/' + helperStack[i]);	
		}
		catch(e){
			try{
				if(this.debug)
				Ti.API.log('Trying to find the helper [[ ' + helperName + ']]after adding the word Helper to it.');
				tempReturn = require('Helpers/' + helperStack[i] + 'Helper');
			}
			catch(e){
				Ti.API.warn('Cannot load helper [[ ' + helperName + ']].');
			}
		}
	
	helpersTemp[helperName] = tempReturn;
	}

	return helpersTemp;
};

