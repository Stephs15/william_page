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

function scrollToSection(section){
    $('html, body').animate({
        scrollTop: $(section).offset().top
    }, 1000);
}

$(document).ready(function () {
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
    $("#picture").hover(function(){

    	 $(this).addClass(animation).one(animEvents, function(){
        	$(this).removeClass(animation);
        });
    });
    $("#occupation").hide();
    $("#name").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    	$("#occupation").show();
    	$("#occupation").addClass('animated slideInLeft');
    });
});

$(window).scroll(function(){
    //checkAnimation();
});

function isElementInViewport(elem) {
    var $elem = $(elem);

    // Get the scroll position of the page.
    var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
    var viewportTop = $(scrollElem).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    // Get the position of the element on the page.
    var elemTop = Math.round( $elem.offset().top );
    var elemBottom = elemTop + $elem.height();

    return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
}


function checkAnimation() {
    var $elem1 = $('#picture');

    // If the animation has already been started
    if ($elem1.hasClass('bounce')) return;

    if (isElementInViewport($elem1)) {
        // Start the animation
        $elem1.addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        	$(this).removeClass('animated bounce');
        });
    }
}


$(document).ready(function(){


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
            data: { name: $(this).name.value, 
                    email: $(this).email.value, 
                    message: $(this).message.value 
            }
        });
        return false;
    }); 
})
