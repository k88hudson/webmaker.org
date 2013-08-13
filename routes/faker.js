var make = require("../lib/makeapi");

module.exports = function (req, res) {
  var options = {};
  console.log(req.query);
  options.page = req.query.page || 1;
  if (req.query.user) {
    options.user = req.query.user;
  } else {
    options.tags = {
      tags: ['webmaker:recommended']
    };
  }
  make.find(options)
    .sortByField("updatedAt", "desc")
    .process(function (err, data, totalHits) {
      if (err) {
        return res.send(err);
      }
      return res.json(data);
    });
};
