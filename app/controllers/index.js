var myMetrics = Alloy.Collections.metrics;
var url = "http://echo.jsontest.com/key/value/name/Sales ($)/value/derping";
//var authURl = "http://echo.jsontest.com/key/value/loggedIn/false";
var authURl = "http://echo.jsontest.com/key/value/loggedIn/true";

//This is running through our network. We can use devnew.arhaus.com to test the ajax request for updating, getting data, etc.

//TODO: Authorization
//TODO: Initialization @0s instead of junk data
//TODO: Sync all button
//TODO: Plan information/Compare
//TODO: Visual styling/styling per plan data
//TODO: Timestamp/staleness indicator??
//TODO: Cleanup/Data Destroy (?)

function getMetrics(){
	var metric = Alloy.createModel("metrics", {
		'name' : 'Sales ($)',
		'value' : '999.99',
		'display_order' : "1",
		'timestamp' : '10/21/16'	
	});
	myMetrics.add(metric);
	metric.save();
	
	 metric = Alloy.createModel("metrics", {
		 'name' : 'Sales (#)',
		 'value' : '9',
		 'display_order' : 2,
		 'timestamp' : '10/29/16'	
	 });
	 myMetrics.add(metric);
	 metric.save();
}
	
	
Ti.API.log("Collection Length: " + Alloy.Collections.metrics.length);

getMetrics();
$.index.open();


function catchUpdateMetricEvent(e){
	var targetRow = null;
	var targetCell = null;
	var metric_name = e.source.update_metric;
	
	for(var i = 0; i<$.metricsTable.data.length; i++){
		for(var j=0; j<$.metricsTable.data[i].rows.length || 0;j++){
			if($.metricsTable.data[i].rows[j].metric_id == e.source.update_metric){
				targetRow = $.metricsTable.data[i].rows[j]; //just a bit easier to read to dump it into a variable...
				targetCell = targetRow.children[1]; //it's always going to be the second child (cell)
			}
		}
	}
	if(targetRow != null && targetCell != null){
		targetCell.setText('Updating...');
	}
	updateMetric(metric_name, targetCell);
}

function updateMetric(name, cell){
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	        var testJSONReturn = JSON.parse(this.responseText);
	        if(testJSONReturn.name.replace('%20', ' ') == name){
	        	cell.setText(testJSONReturn.value);
	        }
	        else{
	        	cell.setText("Failed");
	        }
	    },
	    onerror: function(e) {
	        Ti.API.debug(e.error);
	        alert('There was an error. Please try again later.');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();  // request is actually sent with this statement
}

function cleanup(){
	$.destroy();
}
