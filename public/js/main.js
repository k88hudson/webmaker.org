define(['jquery','base/carousel', 'base/marquee', 'base/privacy', 'sso-ux'],
  function ($, carousel, Marquee, privacy) {
    'use strict';
    var $html = $('html, body');
    var $window = $(window);
    var $backToTop = $('.backToTop');

    // set up CSRF handling
    var csrfToken = $('meta[name="X-CSRF-Token"]').attr('content');
    $.ajaxSetup({
      beforeSend: function(request) {
       request.setRequestHeader('X-CSRF-Token', csrfToken);
      }
    });

    //Footer
    $backToTop.on('click', function (e) {
      $html.animate({scrollTop : 0}, 500);
      return false;
    });
    $window.scroll(function() {
     if ($window.scrollTop() > 100) {
       $backToTop.addClass('addMore');
     } else {
       $backToTop.removeClass('addMore');
     }
    });
    carousel.attachToCTA();

    // Create Partner marquees
    if ($('ul.sponsors').length) {
      $('ul.sponsors').each(function () {
        var marquee = new Marquee(this);
        marquee.startRotation();
      });
    }

    privacy.attach();

    // Set up page-specific js
    var pageJS = $('#require-js').data('page');
    if (pageJS) {
      require([pageJS]);
    }
});
