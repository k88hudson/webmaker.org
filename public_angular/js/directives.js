angular
  .module('exploreApp')
  .directive('mason', ['$window',
    function($window) {
      return {
        restrict: 'EA',
        priority: 0,
        link: function(scope, el) {

          var masonry = new $window.Masonry(el[0], {
            itemSelector: '.mason',
            columnWidth: '.mason',
            transitionDuration: '0.2s'
          });

          el.ready(function() {
            masonry.addItems([el]);
            masonry.reloadItems();
            masonry.layout();
          });

        }
      };
    }
  ])
  .directive('scrollSidebar', ['$window',
    function($window) {
      return {
        restrict: 'EA',
        priority: 0,
        link: function(scope, el, attrs) {
          var windowEl = $($window);
          var offset = +attrs.offset;
          var elTop = el.offset().top + offset;

          windowEl.scroll(function() {
            var scrollTop = windowEl.scrollTop();
            if (scrollTop >= elTop) {
              el.css({
                position:'fixed',
                top: offset + 'px'
              });

            } else {
              el.css({
                position: '',
                top: ''
              });
            }
          });

        }
      };
    }
  ])
  .directive('retinaImage', ['$window',
    function ($window) {
      'use strict';

      function renderImage($image, source) {
        $image.attr('src', source);
      }

      return {
        restrict: 'A',
        link: function (scope, el) {
          if ($window.devicePixelRatio !== undefined && $window.devicePixelRatio >= 1.5) {
            renderImage($(el), $(el).attr('data-src-2x'));
          } else {
            renderImage($(el), $(el).attr('data-src-1x'));
          }
        }
      };
    }]);
