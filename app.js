/**
 * Module dependencies
 */
var util                                          = require('util')
  , express                                       = require('express');

var app             = module.exports              = express.createServer();
app.modules                                       = {};

var everyauth       = app.modules.everyauth       = require('everyauth')
  , mongoose        = app.modules.mongoose        = require('mongoose')
  , mongooseAuth    = app.modules.mongooseAuth    = require('mongoose-auth')
  , conf                                          = require('./conf');


/**
 * Load models
 */
app.db              = mongoose;
app.models          = {};
app.models.Game     = require('./models/Game')(app, conf);
app.models.Player   = require('./models/Player')(app, conf);
 

/**
 * Configuration
 */
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'hariom' }));
  app.use(mongooseAuth.middleware());
  //app.use(stylus.middleware({
    //src: __dirname + '/public'
    //, compile: function(str, path){
      //return stylus(str)
      //.set('filename', path)
      //.set('compress', true)
      //.use(nib());
    //}   
  //}));
  //app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true
  , showStack: true
  }));                                                                                                                                                                   
  app.db.connect(conf.mongodb.uri.development);
  everyauth.debug = true;
});

app.configure('test', function() {
  app.use(express.errorHandler());
  app.db.connect(conf.mongodb.uri.test);
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
  app.db.connect(conf.mongodb.uri.production);
});


/**
 * Helpers
 */
mongooseAuth.helpExpress(app);


/**
 * Load Controllers
 */
app.controllers       = {}
app.controllers.app   = require('./controllers/AppController')(app, conf);


/**
 * Catch-all 404 handler (No more routes after this one)
 */
app.get('/*', function(req, res, next) {
  next(new NotFound('Page not found.'));
});


/**
 * Only listen on $ node app.js
 */
if (!module.parent) {
  app.listen(conf.port);
  console.log("noban server listening on port %d in %s mode", app.address().port, app.settings.env);
}
