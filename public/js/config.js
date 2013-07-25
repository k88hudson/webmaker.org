
requirejs.config({
  baseUrl: '../ext/js',
  paths: {
    'main': './main.js',
    'pages': './pages',
    'base': './base',
    'jquery':           '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    'jquery.carousel':  '../ext/js/jquery.carouFredSel-6.2.1',
    'tabzilla': 'https://www.mozilla.org/tabzilla/media/js/tabzilla',
    'sso-ux':           '/js/sso-ux'
  },
  shim: {
    'jquery.carousel': ['jquery'],
    'sso-ux': ['jquery']
  }
});
