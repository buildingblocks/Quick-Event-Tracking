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
 Version: 0.4

 Handles event tracking through the use of data attributes

*/
(function ($) {

    //Wrap the track event function
    var trackEvent = function (category, action, label, value) {
        if (console !== undefined && console.log !== undefined) {
            console.log('GA tracking event: category=' + category + ', action=' + action + ', label=' + label + ', value=' + value);
        }
        _gaq.push(['_trackEvent', category, action, label, value]);
    };

    var defaultOptions = {
        //The category attribute
        categoryAttribute: 'data-ga-category',
        //The action attribute
        actionAttribute: 'data-ga-action',
        //The label attribute (could be changed to href when tracking file downloads)
        labelAttribute: 'data-ga-label',
        //The value attribute (must be integer)
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
        valid: function (elem) { return true; },
        //Tracking complete
        complete: function (elem) { },
        //When using an event, delay the browser to allow the event to fire
        delay: 0,
        //Category should always be set if using gaTrackEvent
        category: 'Unspecified',
        //Action should always be set if using gaTrackEvent
        action: 'Unspecified'
    });

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
        options = $.extend(defaultOptions, options);

        return this.each(function () {
            var element = $(this);
            element.attr(options.categoryAttribute, options.category);
            element.attr(options.actionAttribute, options.action);

            if (options.useLabel) {
                element.attr(options.labelAttribute, options.label);
            }
            if (options.useValue) {
                element.attr(options.valueAttribute, options.value);
            }
            
            element.gaTrackEventUnobtrusive(options);
        });
    };

    //Create a plugin
    $.fn.gaTrackEventUnobtrusive = function (options) {

        //Merge options
        options = $.extend(defaultOptions, options);

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

                if (options.useLabel && options.useValue) {
                    trackEvent(category, action, label, value);
                }
                else if (options.useLabel) {
                    trackEvent(category, action, label);
                }
                else {
                    trackEvent(category, action);
                }
            };

            //If we want to bind to an event, do it.
            if (options.useEvent == true) {

                //This is what happens when you actually click a button
                var constructedFunction = function () {
                    //Check the callback function
                    if (options.valid(_this) === true) {
                        callTrackEvent();
                        options.complete(_this);
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

    //an alternative way to call the function.
    $.extend({
        ga: {
            trackEvent: trackEvent
        }
    });

})(jQuery);