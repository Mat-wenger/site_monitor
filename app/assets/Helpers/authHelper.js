exports.auth = function(){
	var ajaxHelper = require('ajax');
	ajaxHelper.init('http://echo.jsontest.com/key/value/loggedIn/true',
	function(JSONReturn){Ti.API.log('Successful login:' + JSONReturn.loggedIn);},
	function(){});
	ajaxHelper.fire();
};