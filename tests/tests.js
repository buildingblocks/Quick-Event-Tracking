/*
	Building Blocks Google Analytics Plugin Test Suite
	Author: Robert Stevenson-Leggett
	Date Created: 18/02/2012
*/
$(function() {
	//TESTING BRANCHING
	//Rubbish mocking that I just made up..
	(function(window) { 
		window.jsMock = { 
			mock : function(fn,before,after) { 
				fn = function() { 
					before();
					jQuery('body').append('<img src="utm.gif" />');
					after();
				}
				return fn;
			}
		};
	})((function() {return this}).call() );

	//Replace trackEvent with a fake that appends the variables
	$.ga.trackEvent = jsMock.mock($.ga.trackEvent,function() {}, function() {});

	test('trackEvent can be called directly',function() { 
		//TODO: this is only really testing the mock..
		$.ga.trackEvent({category:'Category',action:'Blah',label:'Blah',value:'Blah'});
		ok($('img[src*="utm.gif"]').length > 0, 'Could not find tracking pixel');
	});

	test('gaTrackEvent adds the category to an element', function() { 
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
		$('#trackMeDiv').gaTrackEvent({
			category:'TestCategory',
			action:'TestAction'
		});

		equal($('#trackMeDiv').attr('data-ga-category'),'TestCategory','Category attribute did not match expected category');
	});

	test('gaTrackEvent adds the action to an element', function() { 
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
		$('#trackMeDiv').gaTrackEvent({
			category:'TestCategory',
			action:'TestAction'
		});

		equal($('#trackMeDiv').attr('data-ga-action'),'TestAction','Action attribute did not match expected action');
	});

	test('gaTrackEvent adds the label to an element when useLabel is true', function() {
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
		$('#trackMeDiv').gaTrackEvent({
			category:'TestCategory',
			action:'TestAction',
			label:'TestLabel',
			useLabel:true
		});
		equal($('#trackMeDiv').attr('data-ga-label'),'TestLabel','Label attribute did not match expected label');
	});

	test('gaTrackEvent adds a value to an element when useValue is true', function() { 
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
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

	test('gaTrackEvent does not add label when useLabel is false', function() { 
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
		$('#trackMeDiv').gaTrackEvent({
			category:'TestCategory',
			action:'TestAction',
			label:'TestLabel',
			useLabel:false
		});
		equal($('#trackMeDiv').attr('data-ga-label'),undefined,'Label was added even though useLabel was false');
	});

	test('gaTrackEvent does not add value when useValue is false', function() { 
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
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
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
		$('#trackMeDiv').gaTrackEvent({
			category:'CategoryTest',
			categoryAttribute:'data-category-test'
		});
		equal($('#trackMeDiv').attr('data-category-test'),'CategoryTest','Category was not set with custom attribute');
	});

	test('gaTrackEvent can override the attribute for the action', function() { 
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
		$('#trackMeDiv').gaTrackEvent({
			category:'CategoryTest',
			action:'ActionTest',
			actionAttribute:'data-action-test'
		});
		equal($('#trackMeDiv').attr('data-action-test'),'ActionTest','Action was not set with the action attribute');
	});

	test('gaTrackEvent can override the attribute for the label', function() { 
		$('#trackMeDiv').remove();
		$('body').append('<div id="trackMeDiv"></div>');
		$('#trackMeDiv').gaTrackEvent({
			category:'CategoryTest',
			action:'ActionTest',
			label:'LabelTest',
			labelAttribute:'data-label-test',
			useLabel:true
		});
		equal($('#trackMeDiv').attr('data-label-test'),'LabelTest','Label attribute was not changed');
	});

});