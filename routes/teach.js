var async = require("async");

module.exports = function( make ) {
  return function( req, res ) {
    var STICKY_PREFIX = "webmaker:teach-";

    function getMakes(isSticky, callback) {
      make
        .tagPrefix(STICKY_PREFIX, !isSticky)
        .tags(['webmaker:recommended', 'guide'])
        .limit( 12 )
        .sortByField( "createdAt", "desc" )
        .process( function( err, data, totalHits ) {
          if (isSticky) {
            data = make.sortByPriority(STICKY_PREFIX, data);
          }
          callback(err, data);
        });
    }

    async.map(["sticky", ""], getMakes, function(err, data) {
      if ( err ) {
        return res.send( err );
      }
      var allMakes = data[0].concat(data[1]);
      res.render( "teach.html", {
        makes: allMakes || [],
        page: "teach"
      });
    });

  };
};
