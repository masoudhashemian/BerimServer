var path        = require('path');
var express     = require('express');
var colors      = require('colors')
var settings    = require('./config/settings');
var environment = require('./config/environment');
var routes      = require('./config/routes');
var sockets =  require('./config/sockets');
var models      = require('./app/models/');
var http = require('http');
var socketServer = require('socket.io');

module.exports.start = function (done) {
  var app = express(); 
  
  var httpServer = http.createServer(app);  
  var io = socketServer.listen(httpServer);    
  
  environment(app);
  routes(app);
  sockets(io, app);

  httpServer.listen(settings.port, function () {
    console.log( ("Listening on port " + settings.port).green );

    if (done) {
      return done(null, app, server);
    }
  }).on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('Address in use. Is the server already running?'.red);
    }
    if (done) {
      return done(e);
    }
  });
}

// If someone ran: "node server.js" then automatically start the server
if (path.basename(process.argv[1],'.js') == path.basename(__filename,'.js')) {
  module.exports.start()
}
