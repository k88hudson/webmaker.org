module.exports = function(app) {
  return function( req, res ) {
    res.set( "Content-Type", "application/javascript;charset=utf-8" );
    res.render("js/app.js", {
      makeEndpoint: app.locals.makeEndpoint,
      personaSSO: app.locals.personaSSO,
      loginAPI: app.locals.loginAPI,
      csrfToken: res.locals.csrf
    });
  };
}
