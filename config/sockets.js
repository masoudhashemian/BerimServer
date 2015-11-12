
var events = require('./events');

module.exports = function (io){
	io.sockets.on('connection', function(socket){
		console.log('we are connected!');
		events(io, socket);
	});
}