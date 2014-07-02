angular
  .module('webmakerApp')
  .controller('navigationController', ['$scope', '$location', '$routeParams', '$rootScope', 'weblit', 'wmNav', 'CONFIG',
    function ($scope, $location, $routeParams, $rootScope, weblit, wmNav, config) {

      // Nav data
      $scope.nav = {
        sections: [
          {
            id: 'explore',
            url: 'explore',
            title: 'Explore',
            icon: 'random',
            pushState: true,
            pages: [
              {
                "id": "index",
                "title": "Gallery",
                "url": "gallery"
              },
              {
                id: 'super-mentor',
                title: 'Super Mentor Badge',
                url: 'badges/webmaker-super-mentor'
              },
              {
                id: 'super-mentor',
                title: 'Hive Community Badge',
                url: 'badges/hive-community-member'
              },
              {
                id: 'badges-admin',
                title: 'Badges Admin',
                url: 'admin/badges',
                pushState: true,
                isAtleastMentor: true
              },
              {
                id: 'search',
                title: 'Search',
                url: 'search'
              }
            ]
          },
          {
            id: 'tools',
            url: 'tools',
            title: 'Tools',
            icon: 'hand-o-up'
          },
          {
            id: 'resources',
            title: 'Resources',
            icon: 'book',
            pushState: true,
            dropdown: true
          },
          {
            id: 'events',
            url: 'events',
            title: 'Events',
            icon: 'map-marker'
          },
          {
            id: 'info',
            url: 'about',
            title: 'Info',
            icon: 'info'
          }
        ]
      };

      // User urls
      $scope.accountSettingsUrl = config.accountSettingsUrl;

      // Start with collapsed state for navigation
      $scope.primaryCollapse = true;
      $scope.secondaryCollapse = true;
      $scope.tertiaryCollapse = true;
      $scope.mobileCollapse = true;

      $scope.isMobile = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
      return check; }

      $scope.collapseToggle = function () {
        $scope.primaryCollapse = !$scope.primaryCollapse;
        $scope.secondaryCollapse = !$scope.secondaryCollapse;
        $scope.tertiaryCollapse = !$scope.tertiaryCollapse;
      };

      $scope.weblitToggle = function () {
        $scope.mobileCollapse = !$scope.mobileCollapse;
      };

      $rootScope.$on('$locationChangeSuccess', function (event) {
        $scope.primaryCollapse = true;
        $scope.secondaryCollapse = true;
        $scope.tertiaryCollapse = true;
        $scope.mobileCollapse = true;
      });

      $scope.clickedResource = false;
      $scope.literacies = weblit.all();

      $scope.page = wmNav.page;
      $scope.section = wmNav.section;

      $scope.isActivePage = function (page) {
        return page === wmNav.page();
      };

      $scope.isActiveSection = function (section) {
        return section === wmNav.section();
      };

    }
  ])
  .controller('exploreController', ['$scope', 'CONFIG', 'wmNav',
    function ($scope, CONFIG, wmNav) {
      wmNav.page('explore');
      wmNav.section('explore');

      $scope.contributeBoxes = [
        {
          icon: 'book',
          title: 'Teaching kits',
          description: 'Teaching kits desc',
          target: '/' + CONFIG.lang + '/teach-templates'
        },
        {
          icon: 'map-marker',
          title: 'Events',
          description: 'Events desc',
          target: 'https://events.webmaker.org/' + CONFIG.lang
        },
        {
          icon: 'globe',
          title: 'Translate',
          description: 'Translate desc',
          target: 'https://support.mozilla.org/' + CONFIG.lang + '/kb/translate-webmaker'
        },
        {
          icon: 'picture-o',
          title: 'Design',
          description: 'Design desc',
          target: 'https://wiki.mozilla.org/Webmaker/Design'
        },
        {
          icon: 'code',
          title: 'Code',
          description: 'Code desc',
          target: 'https://support.mozilla.org/' + CONFIG.lang + '/kb/contribute-webmaker-code'
        },
        {
          icon: 'rocket',
          title: 'Partner',
          description: 'Partner desc',
          target: 'http://party.webmaker.org/' + CONFIG.lang + '/partners'
        }
      ];
    }
  ])
  .controller('homeController', ['$scope', 'wmNav',
    function ($scope, wmNav) {
      wmNav.page('home');
      wmNav.section('');
    }
  ])
  .controller('competencyController', ['$rootScope', '$scope', '$location', '$routeParams', 'weblit', 'CONFIG', '$timeout', 'wmNav',
    function ($rootScope, $scope, $location, $routeParams, weblit, CONFIG, $timeout, wmNav) {
      wmNav.page($routeParams.id);
      wmNav.section('resources');

      $scope.tag = $routeParams.id;

      $scope.skill = weblit.all().filter(function (item) {
        return item.tag === $scope.tag;
      })[0];

      if ($rootScope.contentReady) {
        $scope.content = $rootScope.content[$scope.tag];
      } else {
        $timeout(function () {
          $scope.content = $rootScope.content[$scope.tag];
        }, 500);
      }
      $scope.weblit = weblit;

      $scope.wlcPoints = CONFIG.wlcPoints;

    }
  ])
  .controller('resourceFormController', ['$scope', '$http', 'wmAnalytics',
    function ($scope, $http, analytics) {
      $scope.formData = {};
      $scope.submit = function (form) {

        var data = $scope.formData;
        data.username = $scope._user.username;
        data.email = $scope._user.email;
        data.webliteracy = $scope.skill.term;

        $http
          .post('/api/submit-resource', data)
          .success(function (ok) {
            if (ok) {
              $scope.success = true;
              $scope.formData = {};
              analytics.event('Suggested Web Literacy Resource');
            }
          })
          .error(function (err) {
            console.log(err);
          });
      };
    }
  ])
  .controller('resourcesHomeController', ['$scope', 'weblit', 'wmNav',
    function ($scope, weblit, wmNav) {
      wmNav.page('resources');
      wmNav.section('resources');

      $scope.literacies = weblit.all();
    }
  ])
  .controller('mwcController', ['$rootScope', '$scope', '$routeParams', '$timeout', 'wmNav',
    function ($rootScope, $scope, $routeParams, $timeout, wmNav) {
      wmNav.section('resources');
      wmNav.page('');

      $scope.page = $routeParams.mwc;

      // Keeps controller operations in one function to be fired when $rootScope is ready

      function init() {
        $scope.madewithcode = $rootScope.madewithcode[$scope.page];

      }

      // Don't fire controller until after $rootScope is ready
      if ($rootScope.mwcReady) {
        init();
      } else {
        $timeout(function () {
          init();
        }, 500);
      }
    }
  ])
  .controller('badgesAdminController', ['$rootScope', '$scope', '$http', 'wmNav',
    function ($rootScope, $scope, $http, wmNav) {
      wmNav.page('badges-admin');
      wmNav.section('explore');

      $scope.badges = [];
      $scope.hasPermissions = function (badge) {
        return window.badgesPermissionsModel({
          badge: badge,
          user: $rootScope._user,
          action: 'applications'
        });
      };

      $http
        .get('/api/badges')
        .success(function (badges) {
          $scope.badges = badges;
        });
    }
  ])
  .controller('badgesAdminBadgeController', ['$scope', '$http', '$window', '$routeParams', '$modal', 'wmNav',
    function ($scope, $http, $window, $routeParams, $modal, wmNav) {
      wmNav.page('badges-admin');
      wmNav.section('explore');

      var currentBadge = $routeParams.badge;

      $scope.badge = {};
      $scope.instances = [];
      $scope.badgesError = false;

      // Error handling

      function onError(err) {
        $scope.badgesError = err.error;
        console.log(err);
      }

      // This issues a new badge
      $scope.issueBadge = function (email) {
        $http
          .post('/api/badges/' + currentBadge + '/issue', {
            email: email
          })
          .success(function (data) {
            $scope.badgesError = false;
            $scope.instances.unshift(data);
            $scope.issueEmail = '';
          })
          .error(onError);
      };

      // This revokes badges
      $scope.revokeBadge = function (email) {
        var ok = $window.confirm('Are you sure you want to delete ' + email + "'s badge?");
        if (ok) {
          $http
            .delete('/api/badges/' + currentBadge + '/instance/email/' + email)
            .success(function () {
              for (var i = 0; i < $scope.instances.length; i++) {
                if ($scope.instances[i].email === email) {
                  $scope.instances.splice(i, 1);
                }
              }
            })
            .error(onError);
        }
      };

      // This opens the review application dialog
      $scope.reviewApplication = function reviewApplication(application) {
        $modal.open({
          templateUrl: '/views/partials/review-application-modal.html',
          resolve: {
            application: function () {
              return application;
            }
          },
          controller: ReviewApplicationController
        }).result.then(function (review) {
          $http
            .post('/api/badges/' + currentBadge + '/applications/' + review.id + '/review', {
              comment: review.comment,
              reviewItems: createReviewItems(review.decision)
            })
            .success(function () {
              for (var i = 0; i < $scope.applications.length; i++) {
                if ($scope.applications[i].slug === review.id) {
                  $scope.applications.splice(i, 1);
                }
              }
            })
            .error(onError);
        });
      };

      // Allows all criteria to be satisfied/not satisfied based on single decision

      function createReviewItems(decision) {
        var criteria = $scope.badge.criteria;
        var reviewItems = [];
        // true not allowed due to bug 1021186
        var satisfied = decision === 'yes';

        criteria.forEach(function (item) {
          reviewItems.push({
            criterionId: item.id,
            satisfied: satisfied,
            comment: ''
          });
        });

        return reviewItems;
      }

      var ReviewApplicationController = function ($scope, $modalInstance, application) {
        $scope.review = {
          id: application.slug,
          email: application.learner
        };
        $scope.application = application;
        $scope.ok = function () {
          $modalInstance.close($scope.review);
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };

      // On load, Get all instances
      $http
        .get('/api/badges/' + currentBadge + '/instances')
        .success(function (data) {
          $scope.instances = data.instances;
          $scope.badge = data.badge;
        })
        .error(onError);

      // Also get applications
      $http
        .get('/api/badges/' + currentBadge + '/applications')
        .success(function (data) {
          $scope.applications = data;
        })
        .error(onError);
    }
  ]);
