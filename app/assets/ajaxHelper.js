exports.target_url = '';
exports.success_function = function(){};
exports.failure_function = function(){};
exports.timeout = 5000;

exports.set_url = function(url){Ti.API.log('Setting target url to ' + url); this.target_url = url;};
exports.fail = function(fail){Ti.API.log('Setting failure function'); this.failure_function = fail;};
exports.success = function(success){Ti.API.log('Setting success function'); this.success_function = success;};
exports.set_timeout = function(timeout){Ti.API.log('Setting timeout to ' + timeout); this.timeout = timeout;};

exports.init = function(url, success, fail){
	this.set_url(url);
	this.success(success);
	this.fail(fail);
	
	//exports.set_timeout = function(timeout){Ti.API.log('Init timeout to ' + timeout); this.timeout = timeout;};	
};

exports.fire = function(){
	var that = this;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) { //success
	        that.success_function(JSON.parse(this.responseText));
	    },
	    onerror: function(e) { //failure
	        Ti.API.debug(e.error);
	        that.failure_function();
	    },
	    timeout:5000  /* in milliseconds */ 
	});
	xhr.open("GET", this.target_url);
	xhr.send();	
};
