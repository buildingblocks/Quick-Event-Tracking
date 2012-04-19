/*
	Building Blocks Google Analytics Plugin Test Suite
	Author: Robert Stevenson-Leggett
	Date Created: 18/02/2012
*/
var _gaq = { 
	push:function() {} 
};

module("ga-tests", { 
	setup: function() {
		sinon.spy(_gaq,"push");
		$('body').append('<div id="trackMeDiv"></div>');
	},
	teardown: function() {
	    _gaq.push.restore();
		$('#trackMeDiv').remove();
	}
});

test('gaTrackEvent adds the category to an element', function() { 

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction'
	});
    
	equal($('#trackMeDiv').attr('data-ga-category'),'TestCategory','Category attribute did not match expected category');
});

test('gaTrackEvent calls push with the correct arguments when Category and Action are Set', function() {
	var expectedArgs = ['_trackEvent', 'TestCategory', 'TestAction', undefined, undefined, false ];

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction'
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});

test('gaTrackEvent adds the action to an element', function() { 

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction'
	});

	equal($('#trackMeDiv').attr('data-ga-action'),'TestAction','Action attribute did not match expected action');
});

test('gaTrackEvent adds the label to an element when useLabel is true', function() {

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		useLabel:true
	});
	equal($('#trackMeDiv').attr('data-ga-label'),'TestLabel','Label attribute did not match expected label');
});

test('gaTrackEvent calls push with the correct arguments when Category and Action and Label are Set', function() {
	var expectedArgs = ['_trackEvent', 'TestCategory', 'TestAction', 'TestLabel', undefined, false ];

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		useLabel:true
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});

test('gaTrackEvent adds a value to an element when useValue is true', function() { 

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		value: 0.01,
		useLabel:true,
		useValue:true
	});
	equal($('#trackMeDiv').attr('data-ga-value'),0.01,'Value attribute did not match expected value');
});

test('gaTrackEvent calls push with the correct arguments when Category and Action and Label and Value are Set', function() {
	var expectedArgs = ['_trackEvent', 'TestCategory', 'TestAction', 'TestLabel', '0.01', false ];

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		value: 0.01,
		useLabel:true,
		useValue:true
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});

test('gaTrackEvent does not add label when useLabel is false', function() { 

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		useLabel:false
	});
	equal($('#trackMeDiv').attr('data-ga-label'),undefined,'Label was added even though useLabel was false');
});

test('gaTrackEvent does not add value when useValue is false', function() { 

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		value:0.11,
		useValue:false
	});
	equal($('#trackMeDiv').attr('data-ga-value'),undefined,'Value was added even though useValue was false');
});

test('gaTrackEvent can override the attribute for the category',function() {

	$('#trackMeDiv').gaTrackEvent({
		category:'CategoryTest',
		categoryAttribute:'data-category-test'
	});
	equal($('#trackMeDiv').attr('data-category-test'),'CategoryTest','Category was not set with custom attribute');
});

test('gaTrackEvent calls push with the correct arguments when Category attribute is overridden', function() {
	var expectedArgs = ['_trackEvent', 'CategoryTest', 'Unspecified', undefined, undefined, false ];

	$('#trackMeDiv').gaTrackEvent({
		category:'CategoryTest',
		categoryAttribute:'data-category-test'
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});


test('gaTrackEvent can override the attribute for the action', function() { 

	$('#trackMeDiv').gaTrackEvent({
		category:'CategoryTest',
		action:'ActionTest',
		actionAttribute:'data-action-test'
	});
	equal($('#trackMeDiv').attr('data-action-test'),'ActionTest','Action was not set with the action attribute');
});

test('gaTrackEvent can override the attribute for the label', function() { 

	$('#trackMeDiv').gaTrackEvent({
		category:'CategoryTest',
		action:'ActionTest',
		label:'LabelTest',
		labelAttribute:'data-label-test',
		useLabel:true
	});
	equal($('#trackMeDiv').attr('data-label-test'),'LabelTest','Label attribute was not changed');
});

test('gaTrackEvent calls push with the correct arguments when nonInteractive flag is set', function() {
	var expectedArgs = ['_trackEvent', 'TestCategory', 'TestAction', undefined, undefined, true ];

	$('#trackMeDiv').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		nonInteractive:true
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});