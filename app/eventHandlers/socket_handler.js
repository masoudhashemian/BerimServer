
var request = require('request');
var orm     = require('orm');
var settings = require('../../config/settings');
var helpers = require('./_helpers');

module.exports = function(io ,socket, clients){		
	
	//requests
	socket.on('signUpRequest', function(data){	
		console.log(data);		
		request.post(
			settings.serverAddress+'/user/sign_up',
			{ form: data },
			function (error, response, body) {
				console.log(settings.serverAddress+'/user/sign_up');
				if (!error && response.statusCode == 200) {					
				    user = JSON.parse(body);										
					socket.userId = user.id;
					socket.join(user.roomId);															
					clients.set(socket.userId, socket);	
					error = false;
					res = new Object();
					res.error = error;
					res.data = user;
					console.log(res);
					socket.emit('signUpResponse', res);
				}else{	
					try{
						body = JSON.parse(body);
					}catch(err){
						body = "An error occurred during sing up!";
					}
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = body;													
					socket.emit('signUpResponse', res);
				}
			}
		);	
	});	
	
	socket.on('signInRequest', function(data){	
		request.post(
			settings.serverAddress+'/user/sign_in',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {					
				    user = JSON.parse(body);					
					socket.userId = user.id;					
					clients.set(socket.userId, socket);					
					request.post(
						settings.serverAddress+'/user/get_rooms',
						{ form: {userId: user.id}},
						function (error, response, body){							
							if(!error && response.statusCode == 200){															
								body = JSON.parse(body);
								rooms = body.rooms;
								for(var i = 0 ; i < rooms.length; i++){
									room = rooms[i];	
									console.log(room);
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
								res.errorMessage = "Password or Phone number is incorrect!";		
								socket.emit('signInResponse', res);
							}
						}
					);			
				}else{					
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "Password or Phone number is incorrect!";									
					socket.emit('signInResponse', res);
				}
			}
		);	
	});
	
	socket.on('getChatListRequest', function(data){		
		responseEvent = 'getChatListResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}
		data.userId = socket.userId;
		request.post(
			settings.serverAddress+'/chat/get_chat_list',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					body = JSON.parse(body);
					msgs = body.msgs;
					error = false;
					res = new Object();
					res.error = error;
					res.data = msgs;					
					socket.emit('getChatListResponse', res);
				}else{	
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "Message not found!";		
					socket.emit('getChatListResponse', res);
				}
			}
		);		
	});
	
	socket.on('addPlaceRequest', function(data){
		responseEvent = 'addPlaceResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}	
		request.post(
			settings.serverAddress+'/place/add_place',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					body = JSON.parse(body);
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;					
					socket.emit('addPlaceResponse', res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during adding place!";									
					socket.emit('addPlaceResponse', res);
				}
			}
		);		
	});
	
	socket.on('getPlacesRequest', function(data){
		responseEvent = 'getPlacesResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}	
		request.get(
			settings.serverAddress+'/place/get_places',			
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
					res.errorMessage = "An error occurred during getting places!";									
					socket.emit('addPlaceResponse', res);
				}
			}
		);		
	});
	
	socket.on('addRoomRequest', function(data){		
		responseEvent = 'addRoomResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}	
		request.post(
			settings.serverAddress+'/room/add_room',			
			{form : data},
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					body = JSON.parse(body);
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;					
					socket.emit('addRoomResponse', res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during adding room!";									
					socket.emit('addRoomResponse', res);
				}
			}
		);		
	});
	
	socket.on('addUserToRoomRequest', function(data){
		responseEvent = 'addUserToRoomResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}		
		request.post(
			settings.serverAddress+'/room/add_user_to_room',			
			{form : data},
			function (error, response, body) {
				if (!error && response.statusCode == 200) {	
					body = JSON.parse(body);					
					if(clients.has(body.userId)){
						userSocket = clients.get(body.userId);
						userSocket.join(body.roomId);
					}
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;					
					socket.emit('addUserToRoomResponse', res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during adding user to room!";									
					socket.emit('addUserToRoomResponse', res);
				}
			}
		);
	});

	socket.on('getRoomsRequest', function(data){
		responseEvent = 'getRoomsResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}		
		data.userId = socket.userId;
		request.post(
			settings.serverAddress+'/user/get_rooms',			
			{form : data},						
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;					
					socket.emit('getRoomsResponse', res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during getting rooms!";									
					socket.emit('getRoomsResponse', res);
				}
			}
		);		
	});
	
	socket.on('getUpdatedStatusChatListRequest', function(data){
		responseEvent = 'getUpdatedStatusChatListResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}
		data.userId = socket.userId;
		request.post(
			settings.serverAddress+'/chat/get_updated_status_chat_list',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					body = JSON.parse(body);					
					msgs = body.msgs;
					error = false;
					res = new Object();
					res.error = error;
					res.data = msgs;		
					socket.emit('getUpdatedStatusChatListResponse', res);											
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during getting updated status chat list!";									
					socket.emit('getUpdatedStatusChatListResponse', res);
				}
			}
		);		
	});
	
	//events
	socket.on('sendMessageRequest', function(msg){
		responseEvent = 'sendMessageResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}	
		msg.senderId = socket.userId;
		request.post(
			settings.serverAddress+'/chat/add_message',
			{ form: msg},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					msg = JSON.parse(body);					
					error = false;
					res = new Object();
					res.error = error;
					res.data = {message: 'Message was recieved at server!'};								
					socket.emit('sendMessageResponse', res);
					delete msg.sender.password;
					delete msg.sender.phoneNumber;					
					socket.in(msg.roomId).emit('newMessage', msg);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during sending message!";									
					socket.emit('sendMessageResponse', res);
				}
			}
		);				
	});
	
	socket.on('changeMessageStatusRequest', function(msg){				
		responseEvent = 'changeMessageStatusResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}	
		request.post(
			settings.serverAddress+'/chat/change_message_status',
			{ form: msg},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					message = JSON.parse(body);
					console.log(message);
					error = false;
					res = new Object();
					res.error = error;
					res.data = {message: 'Status of message was changed!'};								
					socket.emit('changeMessageStatusResponse', res);						
					socket.in(message.sender.roomId).emit('changeMessageStatus', message);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during changing message status!";									
					socket.emit('changeMessageStatusResponse', res);
				}
			}
		);			
	});
	
	socket.on('changeMessageStatusGotRequest', function(msg){
		responseEvent = 'changeMessageStatusGotResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}		
		request.post(
			settings.serverAddress+'/chat/change_message_status_got',
			{ form: msg},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					message = JSON.parse(body);					
					error = false;
					res = new Object();
					res.error = error;
					res.data = {message: 'Ok!'};								
					socket.emit('changeMessageStatusGotResponse', res);						
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during changing message update status!";									
					socket.emit('changeMessageStatusGotResponse', res);
				}
			}
		);		
	});
	
	socket.on('disconnect', function() {
		clients.remove(socket.userId);
        console.log(socket.userId+' leaved!');		
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