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
	},
	teardown: function() {
	    _gaq.push.restore();
	}
});

test('gaTrackEvent adds the category to an element', function() { 
    $('body').append('<div id="trackMeDiv1"></div>');
    
	$('#trackMeDiv1').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction'
	});
    
	equal($('#trackMeDiv1').attr('data-ga-category'),'TestCategory','Category attribute did not match expected category');
    $('#trackMeDiv1').remove();
});

test('gaTrackEvent calls push with the correct arguments when Category and Action are Set', function() {
    $('body').append('<div id="trackMeDiv2"></div>');
	var expectedArgs = ['_trackEvent', 'TestCategory', 'TestAction', undefined, undefined, false ];

	$('#trackMeDiv2').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction'
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
     $('#trackMeDiv2').remove();
});

test('gaTrackEvent adds the action to an element', function() { 
    $('body').append('<div id="trackMeDiv3"></div>');
	$('#trackMeDiv3').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction'
	});

	equal($('#trackMeDiv3').attr('data-ga-action'),'TestAction','Action attribute did not match expected action');
    $('#trackMeDiv3').remove();
});

test('gaTrackEvent adds the label to an element when useLabel is true', function() {
    $('body').append('<div id="trackMeDiv4"></div>');
	$('#trackMeDiv4').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		useLabel:true
	});
	equal($('#trackMeDiv4').attr('data-ga-label'),'TestLabel','Label attribute did not match expected label');
    $('#trackMeDiv4').remove();
});

test('gaTrackEvent calls push with the correct arguments when Category and Action and Label are Set', function() {
	var expectedArgs = ['_trackEvent', 'TestCategory', 'TestAction', 'TestLabel', undefined, false ];
    $('body').append('<div id="trackMeDiv5"></div>');
	$('#trackMeDiv5').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		useLabel:true
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});

test('gaTrackEvent adds a value to an element when useValue is true', function() { 
    $('body').append('<div id="trackMeDiv6"></div>');
	$('#trackMeDiv6').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		value: 0.01,
		useLabel:true,
		useValue:true
	});
	equal($('#trackMeDiv6').attr('data-ga-value'),0.01,'Value attribute did not match expected value');
});

test('gaTrackEvent calls push with the correct arguments when Category and Action and Label and Value are Set', function() {
	var expectedArgs = ['_trackEvent', 'TestCategory', 'TestAction', 'TestLabel', '0.01', false ];
    $('body').append('<div id="trackMeDiv7"></div>');
	$('#trackMeDiv7').gaTrackEvent({
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
    $('body').append('<div id="trackMeDiv8"></div>');
	$('#trackMeDiv8').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		useLabel:false
	});
	equal($('#trackMeDiv8').attr('data-ga-label'),undefined,'Label was added even though useLabel was false');
});

test('gaTrackEvent does not add value when useValue is false', function() { 
    $('body').append('<div id="trackMeDiv9"></div>');
	$('#trackMeDiv9').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		label:'TestLabel',
		value:0.11,
		useValue:false
	});
	equal($('#trackMeDiv9').attr('data-ga-value'),undefined,'Value was added even though useValue was false');
});

test('gaTrackEvent can override the attribute for the category',function() {
    $('body').append('<div id="trackMeDiv10"></div>');
	$('#trackMeDiv10').gaTrackEvent({
		category:'CategoryTest',
		categoryAttribute:'data-category-test'
	});
	equal($('#trackMeDiv10').attr('data-category-test'),'CategoryTest','Category was not set with custom attribute');
});

test('gaTrackEvent calls push with the correct arguments when Category attribute is overridden', function() {
	var expectedArgs = ['_trackEvent', 'CategoryTest', 'Unspecified', undefined, undefined, false ];
    $('body').append('<div id="trackMeDiv11"></div>');
	$('#trackMeDiv11').gaTrackEvent({
		category:'CategoryTest',
		categoryAttribute:'data-category-test'
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});


test('gaTrackEvent can override the attribute for the action', function() { 
    $('body').append('<div id="trackMeDiv12"></div>');
	$('#trackMeDiv12').gaTrackEvent({
		category:'CategoryTest',
		action:'ActionTest',
		actionAttribute:'data-action-test'
	});
	equal($('#trackMeDiv12').attr('data-action-test'),'ActionTest','Action was not set with the action attribute');
});

test('gaTrackEvent can override the attribute for the label', function() { 
    $('body').append('<div id="trackMeDiv13"></div>');
	$('#trackMeDiv13').gaTrackEvent({
		category:'CategoryTest',
		action:'ActionTest',
		label:'LabelTest',
		labelAttribute:'data-label-test',
		useLabel:true
	});
	equal($('#trackMeDiv13').attr('data-label-test'),'LabelTest','Label attribute was not changed');
});

test('gaTrackEvent calls push with the correct arguments when nonInteractive flag is set', function() {
	var expectedArgs = ['_trackEvent', 'TestCategory', 'TestAction', undefined, undefined, true ];
    $('body').append('<div id="trackMeDiv14"></div>');
	$('#trackMeDiv14').gaTrackEvent({
		category:'TestCategory',
		action:'TestAction',
		nonInteractive:true
	});
		
	ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});

test('gaTrackEvent should not overwrite the label when useLabel is true', function() { 
    var expectedArgs = ['_trackEvent','TestCategory','TestAction', 'This is the title', undefined, false];
    $('body').append('<a id="trackMe15" title="This is the title"></div>');
    $('#trackMe15').gaTrackEvent({
    	category:'TestCategory',
		action:'TestAction',
        labelAttribute:'title',
        useLabel:true
    });
    
    ok(_gaq.push.calledWith(expectedArgs),'The trackEvent method was not called with the correct arguments!');
});