requirejs.config({
  baseUrl: "/js",
  paths: {
    'text':             '/ext/js/text',
    'jquery':           '/ext/js/jquery-1.9.1',
    'jquery.carousel':  '/ext/js/jquery.carouFredSel-6.2.1',
    'moment':           '/ext/js/moment',
    'social':           '/ext/js/socialmedia',
    'uri':              '/ext/js/uri',
    'tabzilla': 'https://www.mozilla.org/tabzilla/media/js/tabzilla',
    'sso-ux':            '{{loginAPI}}/js/sso-ux'
  },
  shim: {
    'tabzilla': ['jquery'],
    'jquery.carousel': ['jquery'],
    'sso-ux': ['jquery']
  }
});

require(['jquery', 'sso-ux' ],
  function ( $ ) {
    "use strict";

    // set up CSRF handling
    $.ajaxSetup({
      beforeSend: function(request) {
       request.setRequestHeader("X-CSRF-Token", {{csrfToken}});
      }
    });
});
