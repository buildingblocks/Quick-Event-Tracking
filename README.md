#What Google Analytics Plugin?

It's a jQuery plugin that tries to standardise and simplify the way event tracking is implemented within a project. It makes use of HTML5 data attributes and jQuery to try and minimise the effort and cross cutting concerns that tracking often puts into a project.

It was created by Robert Stevenson-Leggett at <a href="http://www.building-blocks.com">Building Blocks</a> and is licenced under the MIT licence.

#Version History
 0.1 - Initial version
 0.2 - Support for direct calling
 0.3 - Bug fixes
 0.4 - Added comments and push to github
 0.5 - Add gaTrackEvent
 0.6 - Bug fixes
 0.7 - Added support for non interactive option
 0.8 - Bug fix with BREAKING CHANGE! $.ga.trackEvent has has it's signiture changes.

#Usage

There are 3 ways to use the plugin. Not all of these will fit every situation.

##Method 1 - Simple Unobtrusive Tracking

Unobtrusive in combination with server side or just HTML. You output a span or any other element to the page and include a class of "track-me" for example:

	<span class="track-me" data-ga-category="Login" data-ga-action="Failed" />

Then in your Javascript initialisation code, you just call the plugin thusly:

	$('.track-me').gaTrackEventUnobtrusive();

In one ASP.NET project, I have encapsulated the span inside a user control that can be hidden and shown at will and also has a setting to only track an event once for a user e.g. Registering. via the use of cookies (I may move this functionality into the plugin soon).

##Method 2 - Unobtrusively Tracking An User Interaction

Many of the events that we would like to track are things which do not trigger a post to the server. In this case we need to call the event on a user interaction. For example if we want to track removing of bookmarks from a list and this is an ajax request.

If we had an anchor tag that triggered the removal of the bookmark.

	<a href="/remove-without-javascript.aspx" data-ga-category="Bookmarks" data-ga-action="Removed" data-ga-label="url-to-bookmark.aspx" class="remove-bookmark track-click">Remove</a>

Notice we've given it a class of "track-click".  We need to call the plugin in our Javascript initialisation code like so:

	$('.track-click').gaTrackEventUnobtrusive({

		useEvent:true,

		useLabel:true,

		event: click

	});

This will look for any element with the class of "track-click" and track clicks on it based on whatever data was attached via the data attributes. We can control the event here for example we could change "click" to hover or any other event. 

##Method 3 - Tracking An User Interaction Without The Data Attributes.

Sometimes for some reason you might not want to use data attributes directly on the element in your user controls or html, so the plugin provides a way to add the attributes from javascript. This is good for adding events to an existing code base, you could hook onto existing classes 

	//Set up for downloads
	$('.track-download-pdf').gaTrackEvent({

		category: 'Download',

		action: 'PDF',

		labelAttribute: "href",

		useEvent: true,

		event: 'click'

	});

So what this will do is look for any element with the class "track-download-pdf" and add the data attributes for tracking. Notice it also uses the href of the element as the label element.

##Available options

There are many options to make the plugin a bit more flexible. Including callback hook functions to evaluate whether to perform tracking These are the default options, you can override any of these by passing them to the plugin.

	var defaultOptions = {

		//The category attribute
		categoryAttribute: 'data-ga-category',

		//The action attribute
		actionAttribute: 'data-ga-action',

		//The label attribute (could be changed to href when tracking file downloads)
		labelAttribute: 'data-ga-label',

		//The value attribute (value must be integer)
		valueAttribute: 'data-ga-value',

		//Whether to look for the label
		useLabel: true,

		//Whether to look for a value
		useValue: false,

		//false = track as soon as the plugin loads, true = bind to an event
		useEvent: false,

		//The event to bind to if useEvent is true
		event: 'click',

		//A method to call to check whether or not we should call the tracking when the event is clicked
		valid: function (elem,e) { return true; },

		//Tracking complete
		complete: function (elem, e) { },


		//Category should always be set if using gaTrackEvent
		category: 'Unspecified',

		//Action should always be set if using gaTrackEvent
		action: 'Unspecified'
		
	});