
var request = require('request');
var orm     = require('orm');
var settings = require('../../config/settings');

module.exports = function(io ,socket, clients){	
	socket.on('broadcast', function(msg){	
		console.log(msg);    
		socket.broadcast.emit('broadcast', msg);
	});
	
	socket.on('disconnect', function() {
		delete clients[socket.id];
        console.log(socket.id+' leaved!');		
    });
	
	socket.on('signIn', function(data){	
		request.post(
			'http://localhost:'+settings.port+'/sign_in',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log("logged in" + body);
				    body = JSON.parse(body);					
					socket.userId = body.id;
					socket.emit('signInResponse', body);
				}else{
					console.log("logged in" + body);
					data.err = body;
					data.status = response.statusCode;	
					socket.emit('signInResponse', data);
				}
			}
		);	
	});
	
	socket.on('getOnlineUsers', function(){			    
	    users = [];		
		numQuery = 0;
		size = Object.keys(clients).length;
		for(k in clients){
			if(clients.hasOwnProperty(k)){				
				sckt = clients[k];				
				io.models.user.get(sckt.userId, function(err, user){	
					numQuery = numQuery + 1;
					users.push(user.serialize());
					if(numQuery == size){
						socket.emit('onlineUser', users);
					}
				});
			}
		}				
	});
};