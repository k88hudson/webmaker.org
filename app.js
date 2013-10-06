if ( process.env.NEW_RELIC_HOME ) {
  require( 'newrelic' );
}

var express = require( "express" ),
    domain = require( "domain" ),
    cluster = require( "cluster" ),
    habitat = require( "habitat" ),
    helmet = require( "helmet" ),
    nunjucks = require( "nunjucks" ),
    path = require( "path" ),
    lessMiddleWare = require( "less-middleware" ),
    i18n = require( "webmaker-i18n" );

habitat.load();

var app = express(),
    env = new habitat(),
    nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader( path.join( __dirname, 'views' )), {
      autoescape: true
    }),
    NODE_ENV = env.get( "NODE_ENV" ),
    WWW_ROOT = path.resolve( __dirname, "public" ),
    server;

nunjucksEnv.addFilter("instantiate", function(input) {
    var tmpl = new nunjucks.Template(input);
    return tmpl.render(this.getVariables());
});

if ( !( env.get( "MAKE_ENDPOINT" ) && env.get( "MAKE_PRIVATEKEY" ) && env.get( "MAKE_PUBLICKEY" ) ) ) {
  throw new Error( "MakeAPI Config setting invalid or missing!" );
}

// Initialize make client so it is available to other modules
require("./lib/makeapi")({
  apiURL: env.get( "MAKE_ENDPOINT" ),
  hawk: {
    key: env.get( "MAKE_PRIVATEKEY" ),
    id: env.get( "MAKE_PUBLICKEY" ),
    algorithm: "sha256"
  }
});

var routes = require("./routes");

nunjucksEnv.express( app );
app.disable( "x-powered-by" );

app.use( express.logger( NODE_ENV === "development" ? "dev" : "" ) );
if ( !!env.get( "FORCE_SSL" ) ) {
  app.use( helmet.hsts() );
  app.enable( "trust proxy" );
}

/**
 * Crash isolation and error handling, logging
 */
if ( env.get( "GRAYLOG_HOST" ) ) {
  GLOBAL.graylogHost = env.get( "GRAYLOG_HOST" );
  GLOBAL.graylogFacility = env.get( "GRAYLOG_FACILITY" );
  require( "graylog" );
}
function reportError( error, isFatal ) {
  try {
    var severity = isFatal ? "CRASH" : "ERROR";
    console.error( severity + ": " + error.stack );
    if ( !GLOBAL.graylogHost ) {
      return;
    }
    log( "[" + severity + "] webmaker.org failure.",
      error.message,
      {
        level: isFatal ? LOG_CRIT : LOG_ERR,
        stack: error.stack,
        _fullStack: error.stack
      }
    );
  } catch( err ) {
    console.error( "Internal Error: unable to report error to graylog, err=" + err );
  }
}
app.use( function( req, res, next ) {
  var guard = domain.create();
  guard.add( req );
  guard.add( res );

  // Safely run a function in error isolation
  function isolate( fn ) {
    try {
      fn();
    } catch( e ) {
      console.error( 'Internal error isolating shutdown sequence: ' + e );
    }
  }

  guard.on( 'error', function( err ) {
    try {
      // Make sure we close down within 15 seconds
      var killtimer = setTimeout( function() {
        process.exit( 1 );
      }, 15000);
      // But don't keep the process open just for that!
      killtimer.unref();

      // Try and report this crash to graylog
      reportError( err, true );

      // Try and shutdown the server, cluster worker
      isolate(function() {
        server.close();
        if ( cluster.worker ) {
          cluster.worker.disconnect();
        }
      });

      // Try sending a pretty 500 to the user
      isolate(function() {
        if (res._headerSent || res.finished) {
          return;
        }

        res.statusCode = 500;
        res.render( 'error.html', { message: err.message, code: err.status });
      });

      guard.dispose();
    } catch( err2 ) {
      console.error( 'Internal error shutting down domain: ', err2.stack );
    }

    process.exit( 1 );
  });

  guard.run( next );
});


app.use( express.compress() );
app.use( express.static( WWW_ROOT ));
app.use( "/bower", express.static( path.join(__dirname, "bower_components" )));

// List of supported languages - Please add them here in an alphabetical order
var listDropdownLang = [ "en-US", "ru-RU", "th-TH" ],
    // We create another array based on listDropdownLang to use it in the i18n.middleware
    // supported_language which will be modified from the i18n mapping function
    supportedLanguages = listDropdownLang.slice(0);

// Setup locales with i18n
app.use( i18n.middleware({
  supported_languages: supportedLanguages,
  default_lang: "en-US",
  mappings: {
    'en': 'en-US',
    'ru': 'ru-RU',
    'th': 'th-TH'
  },
  translation_directory: path.resolve( __dirname, "locale" )
}));

app.use( express.json() );
app.use( express.urlencoded() );
app.use( express.cookieParser() );
app.use( express.cookieSession({
  key: "webmaker.sid",
  secret: env.get( "SESSION_SECRET" ),
  cookie: {
    maxAge: 2678400000, // 31 days. Persona saves session data for 1 month
    secure: !!env.get( "FORCE_SSL" )
  },
  proxy: true
}));
app.use( express.csrf() );

app.locals({
  makeEndpoint: env.get( "MAKE_ENDPOINT" ),
  personaSSO: env.get( "AUDIENCE" ),
  loginAPI: env.get( "LOGIN" ),
  ga_account: env.get( "GA_ACCOUNT" ),
  ga_domain: env.get( "GA_DOMAIN" ),
  supportedLanguages: supportedLanguages,
  listDropdownLang: listDropdownLang
});

app.use(function( req, res, next ) {
  res.locals({
    email: req.session.email || '',
    username: req.session.username|| '',
    makerID: req.session.id || '',
    csrf: req.session._csrf
  });
  next();
});

require( "./lib/events" ).init( app, nunjucksEnv, __dirname );

var optimize = NODE_ENV !== "development",
    tmpDir = path.join( require( "os" ).tmpDir(), "mozilla.webmaker.org" );
app.use( lessMiddleWare({
  once: optimize,
  debug: !optimize,
  dest: tmpDir,
  src: WWW_ROOT,
  compress: optimize,
  yuicompress: optimize,
  optimization: optimize ? 0 : 2
}));
app.use( express.static( tmpDir ) );

// Nunjucks
// This just uses nunjucks-dev for now -- middleware to handle compiling templates in progress
app.use( "/views", express.static(path.join( __dirname, "views" ) ) );

app.use( app.router );
// We've run out of known routes, 404
app.use( function( req, res, next ) {
  res.status( 404 );
  res.render( 'error.html', { code: 404 });
});
// Final error-handling middleware
app.use( function( err, req, res, next) {
  err.status = err.status || 500;
  reportError( err );
  res.status( err.status );
  res.render( 'error.html', { message: err.message, code: err.status });
});

require( "./lib/loginapi" )( app, {
  loginURL: env.get( "LOGINAPI" ),
  audience: env.get( "AUDIENCE" )
});

var middleware = require( "./lib/middleware" );

app.get( "/healthcheck", routes.api.healthcheck );

app.get( "/", routes.gallery({
  layout: "index",
  prefix: "p"
}));
app.get( "/editor", middleware.checkAdmin, routes.gallery({
  page: "editor"
}));
app.get( "/about", routes.page( "about" ) );
app.get( "/teach", routes.gallery({
  layout: "teach",
  prefix: "teach"
}));
app.get( "/starter-makes", routes.gallery({
  layout: "starterMakes",
  prefix: "template",
  limit: 20
}));
app.get( "/party", routes.page( "party" ) );
app.get( "/tools", routes.page( "tools" ) );
app.get( "/teach-templates", routes.page( "teach-templates") );
app.get( "/mentor", routes.page( "mentor" ) );
app.get( "/getinvolved", routes.page( "getinvolved" ) );
app.get( "/event-guides", routes.page( "event-guides" ) );
app.get( "/search", routes.search );
app.get( "/feedback", routes.page( "feedback" ) );
app.get( "/style-guide", routes.page( "style-guide" ) );

app.get( "/details", routes.details );
// Old
app.get( "/details/:id", function(req,res) {
  res.redirect("/details?id=" + req.params.id);
});

app.get( "/me", routes.me );
// Old
app.get( "/myprojects", routes.me );
app.post( "/remove", routes.remove );
app.post( "/like", routes.like.like );
app.post( "/unlike", routes.like.unlike );

// Account
app.get( "/login", routes.user.login );
app.get( "/new", routes.user.newaccount );

app.get( "/t/:tag", routes.tag );
app.get( "/u/:user", routes.usersearch );

app.get( "/teachtheweb", routes.page( "teachtheweb") );

app.get( "/terms", routes.page( "terms" ) );
app.get( "/privacy", routes.page( "privacy" ) );

app.get( "/sso/include.js", routes.includejs( env.get( "HOSTNAME" ) ) );
app.get( "/sso/include.html", routes.include() );
app.get( "/sso/include-transparent.html", routes.include("transparent" ));
app.get( "/sitemap.xml", function(req, res){
  res.type( "xml" );
  res.render("sitemap.xml");
});

// Localized Strings
app.get( "/strings/:lang?", i18n.stringsRoute( "en-US" ) );

// BrowserID SSO realm file
app.get( "/.well-known/browserid-realm", routes.browserid( env.get( "SSO_DOMAINS" )));

/**
 * Legacy Webmaker Redirects
 */
require( "./routes/redirect" )( app );

server = app.listen( env.get( "PORT" ), function() {
  console.log( "Server listening ( http://localhost:%d )", env.get( "PORT" ));
});
