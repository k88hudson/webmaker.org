var async = require("async");

module.exports = function( make ) {
  return function( req, res ) {
    var STICKY_PREFIX = "webmaker:teach-";

    function getMakes(options, callback) {
      make
        .find(options)
        .process( function( err, data, totalHits ) {
          if (options.tagPrefix === STICKY_PREFIX) {
            data = make.sortByPriority(STICKY_PREFIX, data);
          }
          callback(err, data);
        });
    }

    var stickyOptions = {
      tagPrefix: STICKY_PREFIX,
      limit: 12,
      sortByField: ["createdAt", "desc"]
    };

    var normalOptions = {
      tagPrefix: [STICKY_PREFIX, true], // true = NOT search
      tags: { tags: ['webmaker:recommended', 'guide'] },
      limit: 12,
      sortByField: ["createdAt", "desc"]
    };

    async.map([stickyOptions, normalOptions], getMakes, function(err, data) {
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
