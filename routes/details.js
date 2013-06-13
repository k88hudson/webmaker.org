module.exports = function( make ) {
  return function( req, res ) {
    make.id( req.params.id ).process( function( err, data ) {

      if ( err ) {
        return res.send( err );
      }

      if ( data && !data.length ) {
        return res.render( "details.html", {} );
      }

      var makeData = data[ 0 ];

      // Prep remixes, max of 10
      makeData.remixes( function( err, remixData ) {
        if ( err ) {
          return res.send( err );
        }
        makeData.remixes = [];
        for ( var i = 0; i < Math.min( remixData.length, 10 ); i++ ) {
          makeData.remixes.push({
            url: remixData[ i ].url,
            username: remixData[ i ].username
          });
        }

        // Prep original source
        if ( makeData.remixedFrom ) {
          make.id( makeData.remixedFrom ).then( function( err, remixedFromData ) {
            if ( err ) {
              return res.send( err );
            }
            makeData.remixedFromData = {};
            makeData.remixedFromData.url = remixedFromData[ 0 ].url;
            makeData.remixedFromData.username = remixedFromData[ 0 ].username;
            res.render( "details.html", makeData );
          });
        } else {
          // I WILL REMOVE THIS AFTER REVIEW
          if ( req.query.fake ) {
            makeData.remixedFrom = "23223adasd324";
            makeData.remixedFromData = {url:"dasdasd",username:"k88hudson"};
            makeData.remixes = [{url:"dasdasd",username:"k88hudson"},{url:"dasdasd",username:"k88hudson"}];
          }
          res.render( "details.html", makeData );
        }
       });
    });
  };
};
