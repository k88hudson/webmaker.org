define(['jquery', 'uri', 'base/ui'],
  function ($, URI, UI ) {
  'use strict';

  var STICKY_REGEX = /^webmaker:p-(\d+)$/,
      STICKY_PREFIX = "webmaker:p-",
      STICKY_LIMIT = 12;

  var makeURL,
      page,
      make,
      retrieved = 0,
      setup = {};

  function getTags( tagList ) {
    var tag,
        obj = {};

    if ( !tagList ) {
      return obj;
    }

    for ( var i = 0; i < tagList.length; i++ ) {
      tag = tagList[ i ].split( ":" );
      if ( tag.length === 2 ) {
        obj[ tag[ 0 ] ] = tag[ 1 ];
      } else {
        obj[ tag[ 0 ] ] = true;
      }
    }
    return obj;
  }

  setup.template = function() {
    $( ".ui-code" ).each( function( i, el ) {
      var html = el.innerHTML;
      $( el ).text( html );
    });
    UI.select( '#select-test', function( val ) {
      console.log( val );
    });
  };

  setup.page = function( page ) {
    if ( setup[ page ] ) {
      setup[ page ]();
    }
  };

  var self = {
    init: function( options ) {
      makeURL = options.makeURL;
      page = options.page;
      make = new Make({ apiURL: makeURL });
      setup.page( page );
    },
    doSearch: function( options, limit, each, pageNo) {
      var sortBy = 'createdAt',
          sortOrder = 'desc',
          allMakes = [];

      options = options || {};

      if (options.title) {
        sortBy = 'title';
        sortOrder = 'asc';
      }

      function searchCallback( err, results, totalHits ) {
        var result;
        if ( retrieved >= totalHits ) {
          $('.load-more').hide();
        }
        allMakes = allMakes.concat(results);
        for ( var i = 0; i < allMakes.length; i++ ) {
          result = allMakes[ i ];
          result.tags = getTags( result.tags );
          if ( each ) {
            each( result );
          }
        }
      }

      function extractStickyPriority( tags ) {
        var res;
        for ( var i = tags.length - 1; i >= 0; i-- ) {
          res = STICKY_REGEX.exec( tags[ i ] );
          if ( res ) {
            return +res[1];
          }
        }
      }

      function sortByPriority( a, b ) {
        var stickyA = extractStickyPriority( a.appTags ),
            stickyB = extractStickyPriority( b.appTags );
        return stickyA - stickyB;
      }

      function search( isSticky ) {
        options.tagPrefix = [ STICKY_PREFIX, !isSticky ];
        options.limit = isSticky ? STICKY_LIMIT : limit;
        options.sortByField = [ sortBy, sortOrder ];
        options.page = isSticky ? 1 : pageNo;
        make
          .find(options)
          .then( function(err, data, totalHits) {
            if (err) {
              return;
            }
            retrieved += data.length;
            if (isSticky) {
              data.sort(sortByPriority);
              allMakes = allMakes.concat(data);
              search();
            } else {
              searchCallback(err, data, totalHits);
            }
          });
      }
      search(true);
    }
  };

  return self;
});
