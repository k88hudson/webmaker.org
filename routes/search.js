module.exports = function( make, makeURL, personaSSO, loginAPI ) {
  return function( req, res ) {
    var type = req.param( "type" ) || "tags",
        query = req.params.tag || req.param( "q" ),
        makeSize = req.param( "size" ),
        sortByField = req.param( "sortByField" ) || "createdAt",
        sortByOrder = req.param( "order" ) || "desc",
        page = req.param( "page" ) || 1,
        options = {};

    options[ type ] = query || "featured";

    make.find( options )
      .limit( 12 )
      .sortByField( sortByField, sortByOrder )
      .page( page )
      .then( function( err, data ) {
        res.render( "search.html", {
          makes: data || [],
          makeSize: makeSize,
          page: "search",
          pagination: page,
          query: query,
          searchType: type,
          makeEndpoint: makeURL,
          personaSSO: personaSSO,
          loginAPI: loginAPI,
          email: req.session.email || ''
        });
    });
  };
};
