var myMetrics = Alloy.Collections.metrics;
var url = "http://echo.jsontest.com/key/value/name/Sales ($)/value/10,000";
//var authURl = "http://echo.jsontest.com/key/value/loggedIn/false";
var authURl = "http://echo.jsontest.com/key/value/loggedIn/true";
var ajaxHelper = require('ajaxHelper');
//This is running through our network. We can use devnew.arhaus.com to test the ajax request for updating, getting data, etc.

//TODO: Authorization
//TODO: Initialization @0s instead of junk data
//TODO: Sync all button
//TODO: Plan information/Compare
//TODO: Hide all ^^^^ when another one is clicked
//TODO: Visual styling/styling per plan data
//TODO: Timestamp/staleness indicator??
//TODO: Cleanup/Data Destroy (?)
//Alloy.createController("bookdetails", args).getView();

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

getMetrics();
$.index.open();

function retractMetric(e,metric_name){
	Ti.API.log(metric_name);
	for(var i = 0; i<$.metricsTable.data.length; i++){
		for(var j=0; j<$.metricsTable.data[i].rows.length || 0;j++){
			Ti.API.log($.metricsTable.data[i].rows[j].id);
			if($.metricsTable.data[i].rows[j].id == metric_name){
				Ti.API.log('remove the ' + j +'th row.');
				$.metricsTable.data[i].rows[j].remove();
			}
		}
	}
}

function expandMetric(e){
	var targetRowNo = -1;
	var targetCell = null;
	var metric_name = e.source.define_metric;
	
	for(var i = 0; i<$.metricsTable.data.length; i++){
		for(var j=0; j<$.metricsTable.data[i].rows.length || 0;j++){
			if($.metricsTable.data[i].rows[j].metric_id == e.source.define_metric){
				targetRowNo = j;
			}
		}
	}
	if(targetRowNo != -1){
		var newRow = Titanium.UI.createTableViewRow({id:'expanded_metric_' + metric_name});
		var newView = Titanium.UI.createView();
		var newLabel = Titanium.UI.createLabel({text:'A brief description of this metric. \n Should also contain plan information.', left:0,width:"85%"});
		var newCloseLabel = Titanium.UI.createLabel({text:'X', color:'white', backgroundColor: "red",right:2,top:2,width:"10%", textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,});
		newCloseLabel.addEventListener('click', function(event){retractMetric(event, metric_name);});
		
		newView.add(newLabel);
		newView.add(newCloseLabel);
		newRow.add(newView);
		
		$.metricsTable.insertRowAfter(targetRowNo, newRow);
	}
}

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

function updateAllMetrics(){
	
}

function updateMetric(name, cell){	
	ajaxHelper.init(
		url,
		function(JSONReturn){
			if(JSONReturn.name.replace('%20', ' ') == name){
				cell.setText(JSONReturn.value);
				cell.setColor("blue");
			}
			else{
				cell.setText('could not update');
			}
		},
		function(){
			Ti.API.log("failure");
		}
	);
	ajaxHelper.fire();
}
