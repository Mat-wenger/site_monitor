//This is running through our network. We can use devnew.arhaus.com to test the ajax request for updating, getting data, etc.
//TODO: Authorization (index)
//TODO: Sync all button functionality
//TODO: Plan information/Compare
//TODO: Visual styling/styling per plan data
//TODO: Timestamp/staleness indicator??
//TODO: Cleanup/Data Destroy (?)

///VARIABLES:
var args = $.args;
var myMetrics = Alloy.Collections.metrics;
var url = "http://echo.jsontest.com/key/value/name/Sales ($)/value/10,000";
var helpStack = require('Helpers/helpStack');

///"ONLOAD":
helpStack.debug = true;
helpers = helpStack.init(['ajax']);

cleanup();

//--//Set the initial values:
getMetrics();

//FUNCTIONS:
function getMetrics(){
	/*---------------------------------------------
	  getMetrics sets up and 0 populates the table 
	 ---------------------------------------------*/
	var metric = Alloy.createModel("metrics", {
		'name' : 'Sales ($)',
		'value' : '0.00',
		'display_order' : 1,
		'timestamp' : '10/21/16'	
	});
	myMetrics.add(metric);
	metric.save();
	
	 metric = Alloy.createModel("metrics", {
		 'name' : 'Sales (#)',
		 'value' : '0',
		 'display_order' : 2,
		 'timestamp' : '10/29/16'	
	 });
	 myMetrics.add(metric);
	 metric.save();
}

function retractMetric(metric_name){
	/*---------------------------------------------
	  retractMetric should probably be renamed...
	  it removes the row underneath the metric 
	  which provides a brief description and the
	  plan values for a certain metric.
	---------------------------------------------*/
	for(var i = 0; i<$.metricsTable.data.length; i++){
		for(var j=0; j<$.metricsTable.data[i].rows.length || 0;j++){
			if($.metricsTable.data[i].rows[j].id == metric_name){
				$.metricsTable.deleteRow($.metricsTable.data[i].rows[j]);
			}
		}
	}
}

function expandMetric(e){
	/*---------------------------------------------
	  expandMetric will add a row beneath the 
	  clicked metric that contains a brief 
	  description of, and the current plan values
	  for that metric. 
	---------------------------------------------*/
	var targetRowNo = -1;
	var metric_name = e.source.define_metric;
	
	var _extant = fetchTableRow('id', 'expanded_metric_' + metric_name).found;
		
	var _fetchResult = fetchTableRow('metric_id', metric_name);
	
	if(_fetchResult.found && !_extant){
		var newRow = Titanium.UI.createTableViewRow({id:'expanded_metric_' + metric_name});
		var newView = Titanium.UI.createView();
		var newLabel = Titanium.UI.createLabel({text:'A brief description of this metric. \n Should also contain plan information.', left:0,width:"85%"});
		var newCloseLabel = Titanium.UI.createLabel({text:'X', color:'white', backgroundColor: "red",right:2,top:2,width:"10%", textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER});
		newCloseLabel.addEventListener('click', function(event){retractMetric('expanded_metric_' + metric_name);});
		
		newView.add(newLabel);
		newView.add(newCloseLabel);
		newRow.add(newView);
		
		$.metricsTable.insertRowAfter(_fetchResult.targetRowNo, newRow);
	}
}

function catchUpdateMetricEvent(e){
	/*---------------------------------------------
	  catchUpdateMetricEvent is a generic event
	  handler which passes the clicked row info
	  to the updateMetric function
	---------------------------------------------*/
	var metric_name = e.source.update_metric;
	var _fetchResult = fetchTableRow('metric_id', metric_name);
	
	if(_fetchResult.found){
		updateMetric(metric_name,_fetchResult.target.children[1]); //it's always going to be the second child (cell)
	}
	
}

function cleanup(){
	/*---------------------------------------------
	  cleanup empties the collection and forces
	  a refresh of the metrics table 
	---------------------------------------------*/
	myMetrics.remove();
	myMetrics.reset();
}

function updateAllMetrics(){
	/*---------------------------------------------
	  updateAllMetrics fires an ajax hit to the 
	  server and replaces the table with the 
	  returned values or "could not update" 
	---------------------------------------------*/	
	myMetrics.remove();
	myMetrics.reset();
	getMetrics();
	return false;
	for(var i = 0; i<$.metricsTable.data.length; i++){
		for(var j=0; (j<$.metricsTable.data[i].rows.length || 0); j++){
			var _fetchResult = fetchTableRow('metric_id', $.metricsTable.data[i].rows[j].metric_id);
			if(_fetchResult.found){
				Ti.App.addEventListener('ajax_update_' + _fetchResult.target.name.replace(' ', '_') +'_finished', function(){Ti.API.log('update the ' + _fetchResult.target.name + ' field' );});
				updateMetric(_fetchResult.target.name,_fetchResult.target.children[1]); //it's always going to be the second child (cell)
			}
		}
	}	
}

function updateMetric(name, cell){	
	/*---------------------------------------------
	  updateMetric fires an ajax hit to the server
	  and replaces the event initiator's cell
	  value with the returned value, or "could not
	  update" 
	---------------------------------------------*/
	helpers.ajaxHelper.init(
		url,
		function(JSONReturn){
			if(JSONReturn.name.replace('%20', ' ') == name){
				cell.setText(JSONReturn.value);
				cell.setColor("blue");
			}
			else if(JSONReturn.name.replace('%%20', '') == name){
				cell.setText(JSONReturn.value);
				cell.setColor("red");				
			}
			else{
				cell.setText('could not update');
			}
		},
		function(){
			Ti.API.log("failure");
		}
	);
	helpers.ajaxHelper.set_done(function(){Ti.API.log('raising ajax_update' + name + '_finished event');Ti.App.fireEvent('ajax_update_' + name.replace(' ', '_') + '_finished');});
	helpers.ajaxHelper.fire();
}

function fetchTableRow(check_metric, check_value){
	/*---------------------------------------------
	  fetchTableRow should probably be moved to 
	  a helper library. the function checks all
	  table rows for a passed in data-attribute
	  against a passed in value.
	---------------------------------------------*/	
	var targetRow = null;
	var rowNo = -1;
	for(var i = 0; i<$.metricsTable.data.length; i++){
		for(var j=0; (j<$.metricsTable.data[i].rows.length || 0); j++){
			if($.metricsTable.data[i].rows[j][check_metric] == check_value){
				targetRow = $.metricsTable.data[i].rows[j];
				rowNo = j;
			}
		}
	}
	if(targetRow != null){
		return {found: true, target: targetRow, targetRowNo: rowNo};
	}
	return {found: false};
}