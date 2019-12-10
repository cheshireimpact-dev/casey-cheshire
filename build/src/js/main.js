(function() {
  'use strict';
  /*----------------------------------------------------------------------------*/
  // Scripts
  /*----------------------------------------------------------------------------*/  
  $(document).ready(function() {
    function smoothScroll() { // Select all links with hashes and smooth scroll function
      $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(event) { // Remove links that don't actually link to anything
        // On-page links
        if (
          location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html, body').animate({ scrollTop: target.offset().top - 105 }, 1000, function() {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          }
        }
      });
    };
    smoothScroll();  // smoother scroll  function
    function fadeHeader() {      
      $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
          $('#header').addClass('clear-header');
        } else {
          $('#header').removeClass('clear-header');          
        }
      });
    };
    fadeHeader(); // fade outs header of offset trigger function
    function removeWaveEffect(a){
      $(a).click(function(){
          $(this).removeClass('waves-effect waves-light');
      });
    }
    removeWaveEffect('#navbar a'); // removes ripples effect function

    function currentYear(a){ // current year function
      var currentYear = (new Date).getFullYear();
      $(a).text( (new Date).getFullYear() );
    }
    currentYear(".current-year");// current year function

    function scrollToAnchorExternal(){
      jQuery(document).ready(function(){            
      var target = window.location.hash;
      // only try to scroll to offset if target has been set in location hash
      if ( target != '' ){
          var $target = jQuery(target); 
          jQuery('html, body').stop().animate({
          'scrollTop': $target.offset().top - 105}, // set offset value here i.e. 105
          900, 
          'swing',function () {
          window.location.hash = target - 40 ;
          });
      }
      });
    }
    scrollToAnchorExternal();
  });
})();