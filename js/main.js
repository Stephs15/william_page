$(document).ready(function() {
    var myElement = document.querySelector("header");

    var headroom = new Headroom(myElement, {
        "offset": 205,
        "tolerance": 5,
        "classes": {
            "initial": "animated",
            "pinned": "slideDown",
            "unpinned": "slideUp"
        }
    });
    headroom.init();

    // to destroy
    headroom.destroy();
});

function scrollToSection(section) {
    $('html, body').animate({
        scrollTop: $(section).offset().top
    }, 1000);
}

$(document).ready(function() {
    /*Smooth scrolling testing*/
    $('#work').click(function(e) {
        e.preventDefault();
        scrollToSection('#myWorkA');
    });

    $('#about').click(function(e) {
        e.preventDefault();
        scrollToSection('#aboutMeA');
    });

    $('#contact').click(function(e) {
        e.preventDefault();
        scrollToSection('#contactA');
    });

    $('#testimonials').click(function(e) {
        e.preventDefault();
        scrollToSection('#testimonialsA');
    });

    $('header ul li a#about, header ul li a#work').click(function(e) {
        e.preventDefault();
    });

    var animation = "animated swing";
    var animEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $("#picture").hover(function() {

        $(this).addClass(animation).one(animEvents, function() {
            $(this).removeClass(animation);
        });
    });
    $("#occupation").hide();
    $("#name").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $("#occupation").show();
        $("#occupation").addClass('animated slideInLeft');
    });
});

$(window).scroll(function() {
    //checkAnimation();
});

function isElementInViewport(elem) {
    var $elem = $(elem);

    // Get the scroll position of the page.
    var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
    var viewportTop = $(scrollElem).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    // Get the position of the element on the page.
    var elemTop = Math.round($elem.offset().top);
    var elemBottom = elemTop + $elem.height();

    return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
}


function checkAnimation() {
    var $elem1 = $('#picture');

    // If the animation has already been started
    if ($elem1.hasClass('bounce')) return;

    if (isElementInViewport($elem1)) {
        // Start the animation
        $elem1.addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass('animated bounce');
        });
    }
}


$(document).ready(function() {

    $('.expander').simpleexpand();

    $('.contactForm').validate({
        rules: {
            names: {
                required: true,
                minlength: 2,
                required: true
            },

            message: {
                required: true,
                required: true
            },

            email: {
                required: true,
                email: true
            },
        },
        highlight: function(element) {
            $(element).closest('.form-group').removeClass('has-success has-feedback').addClass('has-error has-feedback');
        },
        success: function(element) {
            $(element).closest('.form-group').removeClass('has-error has-feedback').addClass('has-success has-feedback');
        }
    });

}); // end document.ready

$(function() {
    $('#contactform').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'contact-form-handler.php',
            data: {
                name: $(this).name.value,
                email: $(this).email.value,
                message: $(this).message.value
            }
        });
        return false;
    });
}); 


/* Copyright (C) 2012 Sylvain Hamel
Project: https://github.com/redhotsly/simple-expand
MIT Licence: https://raw.github.com/redhotsly/simple-expand/master/licence-mit.txt */

(function ($) {
    "use strict";

    // SimpleExpand 
    function SimpleExpand() {

        var that = this;

        that.defaults = {

            // hideMode
            // -----------
            // Specifies method to hide the content element.
            //
            // Default: fadeToggle
            //
            // Values:
            // - fadeToggle: Use jquery.fadeToggle()
            // - basic: Use jquery.toggle()
            // - css: relies on user provided css to show/hide. you can define
            //   classes for "collapsed" and "expanded" classes.
            // - a function : custom toggle function. The function receives 3 arguments
            //                expander: the element that triggered the toggle
            //                targets: the items to toggle
            //                expanded: true if expanding; false if collapsing
            //
            // If un an unknown value is specified, the plug-in reverts to "css".
            'hideMode': 'fadeToggle',

            // searchMode
            // -----------
            // Specifies the defaut value for  data-expander-target-search
            // when none is specified on the expander element.
            //
            // Default: parent
            //
            // Values:
            // - parent: go up the expander's parents hierarchy searching 
            //           each parent's childens looking for a target
            //
            // - absolute : finds a target globally in the document (useful when 
            //              matching an id)
            //
            // - relative : finds a target nested inside the expander
            //
            // If un an unknown value is specified, no targets will be found.
            'defaultSearchMode': 'parent',

            // defaultTarget
            // -----------
            // Specifies the defaut value for data-expander-target when
            // none is specified on the expander element.
            //
            // Default: .content
            'defaultTarget': '.content',

            // throwOnMissingTarget
            // -----------
            // Specifies whether the plug-in throws an exception if it
            // cannot find a target for the expander 
            //
            // Default: true
            'throwOnMissingTarget': true,

            // keepStateInCookie
            // -----------
            // Specifies whether the plug-in keeps the expended/collapsed state 
            // in a cookie for the next time.
            //
            // Default: false
            //
            // Notes:
            // - This only works for expanders with an Id attribute.
            // - Make sure you load the jQuery cookie plug-in (https://github.com/carhartl/jquery-cookie/)
            //   before simple-expand is loaded.
            //     
            'keepStateInCookie': false,
            'cookieName': 'simple-expand'
        };

        that.settings = {};
        $.extend(that.settings, that.defaults);

        // Search in the children of the 'parent' element for an element that matches 'filterSelector'
        // but don't search deeper if a 'stopAtSelector' element is met.
        //     See this question to better understand what this does.
        //     http://stackoverflow.com/questions/10902077/how-to-select-children-elements-but-only-one-level-deep-with-jquery
        that.findLevelOneDeep = function (parent, filterSelector, stopAtSelector) {
            return parent.find(filterSelector).filter(function () {
                return !$(this).parentsUntil(parent, stopAtSelector).length;
            });
        };

        // Hides targets
        that.setInitialState = function (expander, targets) {
            var isExpanded = that.readState(expander);

            if (isExpanded) {
                expander.removeClass("collapsed").addClass("expanded");
                that.show(targets);
            } else {
                expander.removeClass("expanded").addClass("collapsed");
                that.hide(targets);
            }
        };        

        that.hide = function (targets) {
            if (that.settings.hideMode === "fadeToggle") {
                targets.hide();
                $(".expander").text("Show More");
            } else if (that.settings.hideMode === "basic") {
                targets.hide();
                $(".expander").text("Show More");
            }
        };

        that.show = function (targets) {
            if (that.settings.hideMode === "fadeToggle") {
                targets.show();
                $(".expander").text("Show Less");
            } else if (that.settings.hideMode === "basic") {
                targets.show();
                $(".expander").text("Show Less");
            }
        };

        // assert that $.cookie if 'keepStateInCookie' option is enabled
        that.checkKeepStateInCookiePreconditions = function () {
            if (that.settings.keepStateInCookie && $.cookie === undefined){
                throw new Error("simple-expand: keepStateInCookie option requires $.cookie to be defined.");
            }
        };

        // returns the cookie
        that.readCookie = function () {
            var jsonString = $.cookie(that.settings.cookieName);
            if ( jsonString === null  || jsonString === '' || jsonString === undefined ){
                return {};
            }
            else{
                return JSON.parse(jsonString);
            }
        };

        // gets state for the expander from cookies
        that.readState = function (expander) {

            // if cookies and not enabled, use the current
            // style of the element as the initial value
            if (!that.settings.keepStateInCookie){
                 return expander.hasClass("expanded");
            }

            var id = expander.attr('Id');
            if (id === undefined){
                return;
            }

            var cookie = that.readCookie();
            var cookieValue = cookie[id];

            // if a cookie is stored for this id, used that value
            if (typeof cookieValue !== "undefined"){
                return cookie[id] === true;
            }
            else{
                // otherwise use the current
                // style of the element as the initial value
                return expander.hasClass("expanded");
            }
        };

        // save states of the item in the cookies
        that.saveState = function (expander, isExpanded) {
            if (!that.settings.keepStateInCookie){
                return;
            }

            var id = expander.attr('Id');
            if (id === undefined){
                return;
            }

            var cookie = that.readCookie();
            cookie[id] = isExpanded;
            $.cookie(that.settings.cookieName, JSON.stringify(cookie), { raw: true, path:window.location.pathname });
        };

        // Toggles the targets and sets the 'collapsed' or 'expanded'
        // class on the expander
        that.toggle = function (expander, targets) {

            var isExpanded = that.toggleCss(expander);

            if (that.settings.hideMode === "fadeToggle") {
                targets.fadeToggle(150);
            } else if (that.settings.hideMode === "basic") {
                targets.toggle();
            } else if ($.isFunction(that.settings.hideMode)) {
                that.settings.hideMode(expander, targets, isExpanded);
            }

            that.saveState(expander, isExpanded);

            // prevent default to stop browser from scrolling to: href="#"
            return false;
        };

        // Toggles using css
        that.toggleCss = function (expander) {
            if (expander.hasClass("expanded")) {
                expander.toggleClass("collapsed expanded");
                $(".expander").text("Show More");
                return false;
            }
            else {
                expander.toggleClass("expanded collapsed");
                $(".expander").text("Show Less");
                return true;
            }
        };

        // returns the targets for the given expander
        that.findTargets = function (expander, searchMode, targetSelector) {
            // find the targets using the specified searchMode
            var targets = [];
            if (searchMode === "absolute") {
                targets = $(targetSelector);
            }
            else if (searchMode === "relative") {
                targets = that.findLevelOneDeep(expander, targetSelector, targetSelector);
            }
            else if (searchMode === "parent") {

                    // Search the expander's parents recursively until targets are found.
                var parent = expander.parent();
                do {
                    targets = that.findLevelOneDeep(parent, targetSelector, targetSelector);

                    // No targets found, prepare for next iteration...
                    if (targets.length === 0) {
                        parent = parent.parent();
                    }
                } while (targets.length === 0 && parent.length !== 0);
            }
            return targets;
        };

        that.activate = function (jquery, options) {
            $.extend(that.settings, options);

            that.checkKeepStateInCookiePreconditions();


            // Plug-in entry point
            //
            // For each expander:
            //    search targets
            //    hide targets
            //    register to targets' click event to toggle them on click
            jquery.each(function () {
                var expander = $(this);

                var targetSelector = expander.attr("data-expander-target") || that.settings.defaultTarget;
                var searchMode = expander.attr("data-expander-target-search") || that.settings.defaultSearchMode;

                var targets = that.findTargets(expander, searchMode, targetSelector);

                // no elements match the target selector
                // there is nothing we can do
                if (targets.length === 0) {
                    if (that.settings.throwOnMissingTarget) {
                        throw "simple-expand: Targets not found";
                    }
                    return this;
                }

                that.setInitialState(expander, targets);

                // hook the click on the expander
                expander.click(function () {
                    return that.toggle(expander, targets);
                });
            });
        };
    }

    // export SimpleExpand
    window.SimpleExpand = SimpleExpand;

    // expose SimpleExpand as a jQuery plugin
    $.fn.simpleexpand = function (options) {
        var instance = new SimpleExpand();
        instance.activate(this, options);
        return this;
    };
}(jQuery));