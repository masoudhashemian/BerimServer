
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
					socket.join(user.roomId);
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
	
	socket.on('getChatListRequest', function(data){		
		data.userId = socket.userId;
		request.post(
			'http://localhost:'+settings.port+'/chat/get_chat_list',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;					
					socket.emit('getChatListResponse', res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = body;									
					socket.emit('getChatListResponse', res);
				}
			}
		);		
	});
	
	socket.on('addPlaceRequest', function(data){
		request.post(
			'http://localhost:'+settings.port+'/place/add_place',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;					
					socket.emit('addPlaceResponse', res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = body;									
					socket.emit('addPlaceResponse', res);
				}
			}
		);		
	});
	
	socket.on('getPlacesRequest', function(data){
		request.get(
			'http://localhost:'+settings.port+'/place/get_places',			
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;					
					socket.emit('getPlacesResponse', res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = body;									
					socket.emit('addPlaceResponse', res);
				}
			}
		);		
	});
	
	//events
	socket.on('sendMessageRequest', function(msg){
		msg.senderId = socket.userId;
		request.post(
			'http://localhost:'+settings.port+'/chat/add_message',
			{ form: msg},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					msg = JSON.parse(body);

					error = false;
					res = new Object();
					res.error = error;
					res.data = {message: 'Message was recieved at server!'};								
					socket.emit('sendMessageResponse', res);
					io.sockets.in(msg.roomId).emit('newMessage', msg);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = body;									
					socket.emit('sendMessageResponse', res);
				}
			}
		);				
	});
	
	socket.on('changeMessageStatusRequest', function(msg){		
		request.post(
			'http://localhost:'+settings.port+'/chat/change_message_status',
			{ form: msg},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					body = JSON.parse(body);
					msg = body.message;
					sender = body.sender;

					error = false;
					res = new Object();
					res.error = error;
					res.data = {message: 'Status of message was changed!'};								
					socket.emit('changeMessageStatusResponse', res);			
					console.log(sender.roomId);
					console.log(io.sockets.adapter.rooms);
					io.sockets.in(sender.roomId).emit('changeMessageStatus', msg);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = body;									
					socket.emit('changeMessageStatusResponse', res);
				}
			}
		);			
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