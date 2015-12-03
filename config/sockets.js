var events = require('./events');
var models   = require('../app/models/');

module.exports = function (io, app){ 	
	clients = {};

	io.sockets.on('connection', function(socket){
		console.log('You are connected! You are : '+socket.id);			
			
		clients[socket.id] = socket;

		models(function (err, db) {
			if (!err){
				io.models = db.models;
				io.db     = db;					
			}
		});		
		
		events(io, socket, clients);
	});
}