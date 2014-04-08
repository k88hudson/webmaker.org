'use strict';

angular.module('exploreApp', ['ngRoute', 'ui.bootstrap', 'exploreApp.services', 'webmakerAngular.login', 'localization'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainController'
      })
      .when('/competencies/:id', {
        templateUrl: 'views/competency.html',
        controller: 'competencyController'
      })
      .when('/add', {
        templateUrl: 'views/add.html',
        controller: 'addController'
      })
      .when('/add-success', {
        templateUrl: 'views/add-success.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope', '$http', 'CONFIG', 'weblit',
    function($rootScope, $http, CONFIG, weblit) {

      // Configure CSRF token
      $http.defaults.headers.common['X-CSRF-Token'] = CONFIG.csrf;

      // Scroll
      $rootScope.$on('$locationChangeSuccess', function(event) {
        var ngView = document.querySelector('[ng-view]');
        if (ngView) {
          ngView.scrollTop = 0;
        }
      });

      // Set locale information

      if (CONFIG.supported_languages.indexOf(CONFIG.lang) > 0) {
        $rootScope.lang = CONFIG.lang;
      } else {
        $rootScope.lang = CONFIG.defaultLang;
      }
      $rootScope.direction = CONFIG.direction;
      $rootScope.arrowDir = CONFIG.direction === 'rtl' ? "left" : "right";

      // Set up Web Literacy
      weblit.lang(CONFIG.lang);
      $rootScope.literacies = weblit.all();

      // Set up Kits
      $http
        .get('data/kits.json')
        .success(function (data) {
          $rootScope.kits = data;
        });
    }
  ]);
