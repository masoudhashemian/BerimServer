var events = require('./events');
var models   = require('../app/models/');
var HashMap = require('hashmap');


module.exports = function (io, app){ 	

	var clients = new HashMap();
	
	var numOfConnection = new HashMap();
	
	io.sockets.on('connection', function(socket){
		//console.log('You are connected! You are : '+socket.id);			
		
		numOfConnection.set(socket.id, socket);
		console.log(numOfConnection.keys().length);
				
		events(io, socket, clients, numOfConnection);
	});
}