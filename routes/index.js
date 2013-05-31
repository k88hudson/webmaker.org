module.exports = function( make, makeEndpoint, personaSSO, loginAPI ){
  return {
    api: {
      healthcheck: require( "./api/healthcheck" )
    },
    page: function( view ) {
      return require( "./page" )( view, makeEndpoint, personaSSO, loginAPI );
    },
    search: function() {
      return require( "./search" )( make, makeEndpoint, personaSSO, loginAPI );
    },
    shortcuts: function( shortcut ) {
      return function( req, res ) {
        switch( shortcut ) {
          case "tags":
            res.redirect( "/search?type=tags&q=" + req.params.tag );
            break;
          case "users":
            res.redirect( "/search?type=user&q=" + req.params.username );
            break;
        }
      }
    },
    includejs: function( hostname ) {
      return function( req, res ) {
        res.set( "Content-Type", "application/javascript;charset=utf-8" );
        res.render( "sso/include.js", {
          HOSTNAME: hostname
        });
      };
    },
    myprojects: function() {
      return function( req, res ) {
        res.render( "myprojects.html", { app: "thimble", makeEndpoint: makeEndpoint } );
      };
    }
  };
};
