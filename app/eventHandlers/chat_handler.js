

module.exports = function(io ,socket){
	socket.on('broadcast', function(msg){	    
		socket.broadcast.emit('broadcast', msg);
	})
};