var myMetrics = Alloy.Collections.metrics;
var url = "http://echo.jsontest.com/key/value/name/Sales ($)/value/10,000";
/*
var helpStack = require('Helpers/helpStack');

helpers = helpStack.init(['authHelper','ajax', 'hurrdurr']);
helpers.authHelper.auth();
*/

var authHelper = require('Helpers/authHelper');
authHelper.auth();
var ajaxHelper = require('Helpers/ajax');

//This is running through our network. We can use devnew.arhaus.com to test the ajax request for updating, getting data, etc.
//TODO: Helper algorithm???
//var helpers = ['auth', 'ajax', 'table']
//TODO: Authorization
//TODO: Sync all button functionality
//TODO: Plan information/Compare
//TODO: Hide all ^^^^ when another one is clicked
//TODO: Visual styling/styling per plan data
//TODO: Timestamp/staleness indicator??
//TODO: Cleanup/Data Destroy (?)
//Alloy.createController("bookdetails", args).getView();

function getMetrics(){
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

getMetrics();
$.index.open();

function retractMetric(metric_name){
	for(var i = 0; i<$.metricsTable.data.length; i++){
		for(var j=0; j<$.metricsTable.data[i].rows.length || 0;j++){
			if($.metricsTable.data[i].rows[j].id == metric_name){
				$.metricsTable.deleteRow($.metricsTable.data[i].rows[j]);
			}
		}
	}
}

function expandMetric(e){
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
	var metric_name = e.source.update_metric;
	var _fetchResult = fetchTableRow('metric_id', metric_name);
	
	if(_fetchResult.found){
		updateMetric(metric_name,_fetchResult.target.children[1]); //it's always going to be the second child (cell)
	}
	
}

function updateAllMetrics(){
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
	ajaxHelper.init(
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
	ajaxHelper.set_done(function(){Ti.API.log('raising ajax_update' + name + '_finished event');Ti.App.fireEvent('ajax_update_' + name.replace(' ', '_') + '_finished');});
	ajaxHelper.fire();
}

function fetchTableRow(check_metric, check_value){
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