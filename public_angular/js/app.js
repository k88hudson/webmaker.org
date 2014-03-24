'use strict';

angular.module('exploreApp', [
  'ngRoute',
  'slugifier',
  'ui.bootstrap',
  'exploreApp.services',
  'webmakerAngular.login',
  'localization'
])
.config([
  '$routeProvider',
  function($routeProvider) {
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
      .otherwise({
        redirectTo: '/'
      });
  }
])
.run([
  '$rootScope',
  '$http',
  'CONFIG',
  function($rootScope, $http, CONFIG) {
    $http.defaults.headers.common['X-CSRF-Token'] = CONFIG.csrf;

      // Scroll to top on location change
      $rootScope.$on('$locationChangeSuccess', function () {
        window.scrollTo(0, 0);
      });

      // Set locale information
      if (CONFIG.supported_languages.indexOf(CONFIG.lang) > 0) {
        $rootScope.lang = CONFIG.lang;
      } else {
        $rootScope.lang = CONFIG.defaultLang;
      }
      $rootScope.direction = CONFIG.direction;
      $rootScope.arrowDir = CONFIG.direction === 'rtl' ? 'left' : 'right';

    });
  }
]);
