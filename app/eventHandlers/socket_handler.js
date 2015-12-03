
var request = require('request');
var orm     = require('orm');
var settings = require('../../config/settings');

module.exports = function(io ,socket, clients){	

	//requests
	socket.on('signUpRequest', function(data){			
		request.post(
			'http://localhost:'+settings.port+'/user/sign_up',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {					
				    user = JSON.parse(body);										
					socket.userId = user.id;									
					request.post(
						'http://localhost:'+settings.port+'/user/get_rooms',
						{ form: {userId: user.id}},
						function (error, response, body){							
							if(!error && response.statusCode == 200){	
								rooms = JSON.parse("[" + body + "]");
								for(var i = 0 ; i < rooms.length; i++){
									room = rooms[i];
									socket.join(room);
								}
								error = false;
								res = new Object();
								res.error = error;
								res.data = user;								
								socket.emit('signUpResponse', res);								
							}else{				
								error = true;
								res = new Object();
								res.error = error;
								res.errorMessage = body;									
								socket.emit('signUpResponse', res);
							}
						}
					);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = body;									
					socket.emit('signInResponse', res);
				}
			}
		);	
	});	
	
	socket.on('signInRequest', function(data){	
		request.post(
			'http://localhost:'+settings.port+'/user/sign_in',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {					
				    user = JSON.parse(body);					
					socket.userId = user.id;
					request.post(
						'http://localhost:'+settings.port+'/user/get_rooms',
						{ form: {userId: user.id}},
						function (error, response, body){							
							if(!error && response.statusCode == 200){	
								rooms = JSON.parse("[" + body + "]");
								for(var i = 0 ; i < rooms.length; i++){
									room = rooms[i];													
									socket.join(room);
								}
								error = false;
								res = new Object();
								res.error = error;
								res.data = user;								
								socket.emit('signInResponse', res);								
							}else{				
								error = true;
								res = new Object();
								res.error = error;
								res.errorMessage = body;									
								socket.emit('signInResponse', res);
							}
						}
					);					
				}else{					
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = body;									
					socket.emit('signInResponse', res);
				}
			}
		);	
	});
	
	
	//events
	socket.on('sendMessageRequest', function(msg){
		
		io.sockets.in(msg.roomId).emit('getMessageRequest', msg);		
	});
	
	socket.on('disconnect', function() {
		delete clients[socket.id];
        console.log(socket.id+' leaved!');		
    });	
	
	socket.on('getOnlineRoomsRequest', function(){				
	    users = [];				
		size = Object.keys(clients).length;
		for(k in clients){
			if(clients.hasOwnProperty(k)){				
				sckt = clients[k];				
				users.push(sckt.userId);
			}
		}
		res = new Object();
		res.error = false;
		res.data = users;
		socket.emit('getOnlineUsersResponse', res);
	});
};