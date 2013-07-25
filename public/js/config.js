
requirejs.config({
  baseUrl: 'js',
  paths: {
    'pages': './pages',
    'base': './base',
    'jquery': '../ext/js/jquery-1.9.1',
    'jquery.carousel': '../ext/js/jquery.carouFredSel-6.2.1',
    'moment': '../ext/js/moment',
    'social': '../ext/js/socialmedia',
    'uri': '../ext/js/uri',
    'text': '../ext/js/text',
    'sso-ux': '/js/sso-ux',
    'make-api': '..ext/js/make-api'
  },
  shim: {
    'jquery.carousel': ['jquery'],
    'sso-ux': ['jquery']
  }
});

require(['jquery', 'sso-ux', 'make-api']);
