///VARIABLES:
var signedIn = false;
var signInWindow = null;

///FUNCTIONS:
function signIn(){
	signInWindow = Alloy.createController("metric", {}).getView();
	signInWindow.addEventListener('open', function(){ //needs open so it works on quick close/resume
		signInWindow.activity.addEventListener("resume", function() {
        	Ti.App.fireEvent('resume');
    	});
    	signInWindow.activity.addEventListener("pause", function() {
        	Ti.App.fireEvent('paused');
    	});
	});
	signInWindow.open();
}

//APP EVENTS:
Ti.App.addEventListener('resume',function(){
	if(signedIn == false || signInWindow != null){
		signInWindow.close();
	}
});
Ti.App.addEventListener('paused',function(){
	signedIn = false;
});

//START IT!:
$.index.open();