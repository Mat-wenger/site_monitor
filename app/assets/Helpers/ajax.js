exports.target_url = '';
exports.success_function = function(){};
exports.failure_function = function(){};
exports.timeout = 5000;

exports.set_url = function(url){this.target_url = url;};
exports.fail = function(fail){this.failure_function = fail;};
exports.success = function(success){this.success_function = success;};
exports.set_timeout = function(timeout){this.timeout = timeout;};
exports.set_done = function(done){this.done = done;};

exports.init = function(url, success, fail){
	this.set_url(url);
	this.success(success);
	this.fail(fail);
	if(arguments[3] != undefined)
		exports.set_timeout = function(timeout){this.timeout = timeout;};
};

exports.fire = function(){
	var that = this;
	var xhr = Ti.Network.createHTTPClient({
		onreadystatechange: function(e) {
			switch(this.readyState) {
				/*case 0:
					// after HTTPClient declared, prior to open()
					// though Ti won't actually report on this readyState
					that.declared() || function (){};
				break;
				case 1:
					// open() has been called, now is the time to set headers
					that.setHeader() || function (){};
				break;
				case 2:
					// headers received, xhr.status should be available now
					that.statusChange() || function (){};
				break;
				case 3:
					// data is being received, onsendstream/ondatastream being called now
					that.receiving() || function (){};
				break;*/
				case 4:
					// done, onload or onerror should be called now
					(that.done || function (){})();
				break;
			}
		},
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
