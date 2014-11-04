/*!
 Google Analytics Event Tracking jQuery Plugin

 Copyright (C) 2011 by Building Blocks UK

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 Author: Robert Stevenson-Leggett
 Version: 0.92

 Handles event tracking through the use of data attributes

 Version history:

 0.1 - Initial version
 0.2 - Support for direct calling
 0.3 - Bug fixes
 0.4 - Added comments and push to github
 0.5 - Add gaTrackEvent
 0.6 - Bug fixes
 0.7 - Added non interactive option
 0.8 - Bug fix
 0.9 - Added more tests
 0.91 - Bug fix
 0.92 - Bug fix for useLabel

*/
(function ($) {

    // Extend the jQuery object with the ga trackEvent function. Other functions can call this method, or
    // it can be called directly from existing JS code to add tracking
    // Can be used anywhere in your Javascript like so:
    // $.ga.trackEvent({ category : 'Category', action : 'Action', label : 'Label', value : 0.0});
    // $.ga.trackEvent({ category : 'Category', action: 'Action' });
    //
    // This also enables unit tests to overide this function for testing purposes.
    $.extend({
        ga: {
            trackEvent: function(args) {
                var defaultArgs = {
                    category : 'Unspecified',
                    action: 'Unspecified',
                    nonInteractive:false
                };
                args = $.extend(defaultArgs,args);

                if (typeof ga !== 'undefined') {
                    ga('send', 'event', args.category, args.action, args.label, args.value, {'nonInteraction': args.nonInteractive});
                } else if (typeof _gaq !== 'undefined') {
                    _gaq.push(['_trackEvent', args.category, args.action, args.label, args.value, args.nonInteractive]);
                } else {
                    throw new ReferenceError("ga and _gaq are both undefined.");
                }
            }
        }
    });

    var defaultOptions = {
        //The category attribute
        categoryAttribute: 'data-ga-category',
        //The action attribute
        actionAttribute: 'data-ga-action',
        //The label attribute (could be changed to href when tracking file downloads)
        labelAttribute: 'data-ga-label',
        //The value attribute (must be integer)
        valueAttribute: 'data-ga-value',
        //An attribute to indicate whether the event is non-interactive (defaults to false)
        noninteractiveAttribute: 'data-ga-noninteractive',
        //Whether to look for the label
        useLabel: false,
        //Whether to look for a value
        useValue: false,
        //false = track as soon as the plugin loads, true = bind to an event
        useEvent: false,
        //The event to bind to if useEvent is true
        event: 'click',
        //A method to call to check whether or not we should call the tracking when the event is clicked
        valid: function (elem, e) { return true; },
        //Tracking complete
        complete: function (elem, e) { },
        //Category should always be set if using gaTrackEvent
        category: 'Unspecified',
        //Action should always be set if using gaTrackEvent
        action: 'Unspecified',
        //Label can be specified if using gaTrackEvent and useLabel == true
        label: '',
        //value can be specified if using gaTrackEvent and useValue == true
        value: '',
        //non-interactive - only used if using gaTrackEvent
        nonInteractive: false
    };

    //
    // gaTrackEvent adds unobtrusive tracking attributes itself
    // So you can add tracking to links etc.
    //
    // This allows to do sitewide event tracking e.g. Document Downloads just
    // by selecting the elements e.g.
    //
    //
    //  $('.track-download').gaTrackEvent({
    //          category:'Downloads', action:'PDF', useEvent:true, event:'click'
    //    });
    //
    $.fn.gaTrackEvent = function (options) {
        options = $.extend({}, defaultOptions, options);

        return this.each(function () {
            var element = $(this);
            element.attr(options.categoryAttribute, options.category);
            element.attr(options.actionAttribute, options.action);

            if (options.useLabel === true && options.label !== '') {
                element.attr(options.labelAttribute, options.label);
            }
            if (options.useValue === true && options.value !== '') {
                element.attr(options.valueAttribute, options.value);
            }
            if (options.nonInteractive === true) {
            	element.attr(options.noninteractiveAttribute, "true");
            }

            element.gaTrackEventUnobtrusive(options);
        });
    };

    //Create the plugin
	// gaTrackEventUnobtrusive expects you to add the data attributes either via server side code
	// or direct into the mark up.
    $.fn.gaTrackEventUnobtrusive = function (options) {

        //Merge options
        options = $.extend({}, defaultOptions, options);

        //Keep the chain going
        return this.each(function () {

            var _this = $(this);

            //Wrap the tracking so we can reuse it.
            var callTrackEvent = function () {
                //Retreive the info
                var category = _this.attr(options.categoryAttribute);
                var action = _this.attr(options.actionAttribute);
                var label = _this.attr(options.labelAttribute);
                var value = _this.attr(options.valueAttribute);
                var nonInteractive = (_this.attr(options.noninteractiveAttribute) === 'true');

                var args = {
                    category : category,
                    action : action,
                    nonInteractive : nonInteractive
                };

                if (options.useLabel && options.useValue) {
                   args.label = label;
                   args.value = value;
                }
                else if (options.useLabel) {
                    args.label = label;
                }

                $.ga.trackEvent(args);
            };

            //If we want to bind to an event, do it.
            if (options.useEvent == true) {

                //This is what happens when you actually click a button
                var constructedFunction = function (e) {
                    //Check the callback function
                    if (options.valid(_this, e) === true) {
                        callTrackEvent();
                        options.complete(_this, e);
                    }
                };

                //E.g. if we are going to click on a link
                _this.bind(options.event, constructedFunction);
            }
            else {
                //Otherwise just track immediately (e.g. if we just came from a post-back)
                callTrackEvent();
            }
        });
    };

})(jQuery);
