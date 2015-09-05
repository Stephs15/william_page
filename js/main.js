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
