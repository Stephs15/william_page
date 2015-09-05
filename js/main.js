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
});
