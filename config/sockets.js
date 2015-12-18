var events = require('./events');
var models   = require('../app/models/');
var HashMap = require('hashmap');


module.exports = function (io, app){ 	

	var clients = new HashMap();
	
	io.sockets.on('connection', function(socket){
		console.log('You are connected! You are : '+socket.id);			
				
		events(io, socket, clients);
	});
}