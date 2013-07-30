var async = require("async"),
    make = require("../lib/makeapi");

  module.exports = function(options) {
    return function(req, res) {
      var DEFAULT_PREFIX = "p",
          DEFAULT_LAYOUT = "index",
          STICKY_LIMIT = 24, // Larger to account for possible duplicates
          LIMIT = 12,
          layouts = {
            index: {
              template: "make-flip.html",
              tags: ['webmaker:recommended'],
              process: function(makes) {
                if( makes[2] ) {
                  makes[2].size = "large";
                }
                if( makes[3] ) {
                  makes[3].size = "large";
                }
                return makes;
              }
            },
            teach: {
              template: "make-teach.html",
              tags: ['webmaker:recommended','guide']
            }
          };

      options = options || {};

      // prefix: Set the app-tag prefix for our intial layout settings
      var prefix = options.prefix || (req.query.prefix || DEFAULT_PREFIX).toString(),
          stickyPrefix = "webmaker:" + (prefix + "-");

      // layout: Choose a layout - should it look like the home or teach page?
      // Sets the processing function and template piece
      var layoutName = options.layout || (req.query.layout || DEFAULT_LAYOUT).toString(),
          layout = layouts[layoutName] || layouts[DEFAULT_LAYOUT];
      layout.name = layoutName;

      // page: This is for rendering the view.
      var page = options.page || layoutName;

      function getMakes(options, callback) {
        make
          .find(options)
          .process( function( err, data, totalHits ) {
            callback(err, data);
          });
      }

      var stickyOptions = {
        tagPrefix: stickyPrefix,
        limit: STICKY_LIMIT,
        sortByField: ["createdAt", "desc"]
      };

      var normalOptions = {
        tagPrefix: [stickyPrefix, true], // true = NOT search
        tags: { tags: layout.tags },
        limit: LIMIT,
        sortByField: ["createdAt", "desc"]
      };

      async.map([stickyOptions, normalOptions], getMakes, function(err, data) {
        var sticky = [],
            warnings = [],
            normal,
            all = [],
            sortByPriorityResults;

        if (err) {
          return res.send(err);
        }

        if (data[0].length) {
          sortByPriorityResults = make.sortByPriority(stickyPrefix, data[0]);
          sticky = sortByPriorityResults.results;
          warnings = warnings.concat(sortByPriorityResults.errors);
        }

        // Send warning messages to editor about missing stickies
        for(i=0; i<LIMIT; i++) {
          if(!sticky[i]) {
            warnings.push("No sticky set for " + stickyPrefix + (i+1));
          }
        }

        normal = data[1];
        all = sticky.concat(normal);

        // Is there a special processing function for this layout?
        if (layout.process) {
          all = layout.process(all);
        }

        res.render( page + ".html", {
          makes: all,
          warnings: warnings,
          page: page,
          prefix: prefix,
          layout: layout.name,
          template: layout.template,
          isAdmin: req.isAdmin || false
        });
      });
    };
  };
