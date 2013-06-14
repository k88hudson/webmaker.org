module.exports = function( make ) {
  var MAX_REMIXES = 5;
  return function( req, res ) {

    function renderError(message) {
      return res.render("details.html", {error: message});
    }

    // Use a URL in the querystring or an ID
    var searchOptions = {},
        searchCriteria;
    if ( req.query.id ) {
      searchCriteria = "id";
      searchOptions.id = req.query.id;
    } else if ( req.query.url ) {
      searchCriteria = "url";
      searchOptions.url = decodeURIComponent( req.query.url );
    } else {
      return renderError("No URL or ID was passed");
    }

    make.find(searchOptions).process( function( err, data ) {
      if ( err ) {
        return renderError("Looks like there is a problem with the make API");
      }
      if ( data && !data.length ) {
        return renderError("No make was found :(");
      }
      var makeData = data[ 0 ];

      // Prep remixes, max of 10
      makeData.remixes( function( err, remixData ) {
        if ( err ) {
          return renderError("Looks like there is a problem with the make API");
        }
        makeData.remixes = [];

        for ( var i = 0; i < Math.min( remixData.length, MAX_REMIXES ); i++ ) {
          makeData.remixes.push({
            url: remixData[ i ].url,
            username: remixData[ i ].username
          });
        }

        if ( remixData.length >= MAX_REMIXES ) {
          makeData.remixCount = remixData.length + "+ remixes";
        } else if ( remixData.length > 1 ) {
          makeData.remixCount = remixData.length + " remixes";
        } else if ( remixData.length === 1 ) {
          makeData.remixCount = "1 remix";
        }

        // Prep original source
        if ( makeData.remixedFrom ) {
          make[ searchCriteria ]( makeData.remixedFrom ).then( function( err, remixedFromData ) {
            if ( err ) {
              return renderError( "Looks like there is a problem with the make API" );
            }

            if ( remixedFromData && remixedFromData.length ) {
              makeData.remixedFromData = {};
              makeData.remixedFromData.url = remixedFromData[ 0 ].url;
              makeData.remixedFromData.username = remixedFromData[ 0 ].username;
            }
            res.render( "details.html", makeData );
          });
        } else {
          res.render( "details.html", makeData );
        }
       });
    });
  };
};
