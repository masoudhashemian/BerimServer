
var request = require('request');
var orm     = require('orm');
var settings = require('../../config/settings');
var helpers = require('./_helpers');
var fs = require('fs');
var md5 = require('md5');
var HashMap = require('hashmap');

module.exports = function(io ,socket, clients, numOfConnection){		
	
	//requests
	/*socket.on('signUpRequest', function(data){			
		request.post(
			settings.serverAddress+'/user/sign_up',
			{ form: data },
			function (error, response, body) {				
				if (!error && response.statusCode == 200) {					
				    user = JSON.parse(body);										
					//socket.userId = user.id;
					//socket.join(user.roomId);															
					//clients.set(socket.userId, socket);	
					receptor = user.phoneNumber;
					message = "Your activation code is : "+user.activationCode;
					//res = helpers.sendSMS(receptor, message);					
					console.log(message);
					error = false;
					res = new Object();
					res.error = error;
					res.data = user;
					console.log(res);
					//res.data = md5(res.data);
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
					if(user.active){
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
										console.log(room.id);									
										socket.join(room.id);
									}	
								
									error = false;
									res = new Object();
									res.error = error;
									res.data = user;	
									//res.data = md5(res.data);
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
						res.errorMessage = "User account is not activated!";									
						socket.emit('signInResponse', res);					
					}
				}else{					
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "Password or Phone number is incorrect!";									
					socket.emit('signInResponse', res);
				}
			}
		);	
	});*/
	
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
					console.log('founc:'+msgs.length);
					/*for(var i = 0 ; i < msgs.length ; i++){
						msg = msgs[i];
						try{
							msg.file = helpers.loadAttachment(msg);
							msgs[i] = msg;
						}catch(err){}						
					}*/
					error = false;
					res = new Object();
					res.error = error;
					res.data = msgs;		
					//res.data = md5(res.data);
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
			settings.serverAddress+'/place/add',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					body = JSON.parse(body);
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;		
					//res.data = md5(res.data);
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
					places = JSON.parse(body).places;
					res = new Object();
					res.error = error;
					res.data = places;		
					//res.data = md5(res.data);
					console.log(res);
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
		data.userId = socket.userId;
		request.post(
			settings.serverAddress+'/room/add_room',			
			{form : data},
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					room = JSON.parse(body);
					socket.join(room.id);
					error = false;
					res = new Object();
					res.error = error;
					res.data = room;		
					//res.data = md5(res.data);
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
		data.actorId = socket.userId;
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
					//res.data = md5(res.data);
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
					rooms = JSON.parse(body).rooms;					
					error = false;
					res = new Object();
					res.error = error;
					res.data = rooms;	
					//res.data = md5(res.data);
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
					//res.data = md5(res.data);
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
	
	socket.on('getUserInfoRequest', function(data){
		responseEvent = 'getUserInfoResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}		
		request.post(
			settings.serverAddress+'/user/get_user_info',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					user = JSON.parse(body);										
					if(clients.has(user.id)){
						user.status = "online";
					}else{
						user.status = "offline";
					}
					error = false;
					res = new Object();
					res.error = error;
					res.data = user;
					//res.data = md5(res.data);
					socket.emit('getUserInfoResponse', res);											
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during getting user info!";									
					socket.emit('getUserInfoResponse', res);
				}
			}
		);		
	});	
	
	socket.on('searchUserRequest', function(data){
		responseEvent = 'searchUserResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}		
		data.userId = socket.userId;
		console.log(data);
		request.post(
			settings.serverAddress+'/user/search_user',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					body = JSON.parse(body);					
					users = body.users;
					for (var i = 0 ; i < users.length ; i++){
						user = users[i];
						delete user.password;
					}
					error = false;
					res = new Object();
					res.error = error;
					res.data = users;	
					//res.data = md5(res.data);
					socket.emit('searchUserResponse', res);											
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during searching user!";									
					socket.emit('searchUserResponse', res);
				}
			}
		);		
	});		
	
	socket.on('setAvatarRequest', function(data){		
		responseEvent = 'setAvatarResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}							
		data.userId = socket.userId;											
		request.post(
			settings.serverAddress+'/user/set_avatar',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					user = JSON.parse(body);										
					error = false;
					res = new Object();
					res.error = error;
					res.data = user;	
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);											
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during setting avatar for user!";									
					socket.emit(responseEvent, res);
				}
			}
		);		
	});		

	socket.on('resendActivationCodeRequest', function(data){
		responseEvent = 'resendActivationCodeResponse';					
		request.post(
			settings.serverAddress+'/user/resend_activation_code',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					user = JSON.parse(body);					
					error = false;
					res = new Object();
					res.error = error;
					//res.data = {message: 'Activation Code was resent!'};
					res.data = {activationCode: user.activationCode};
					socket.emit(responseEvent, res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during authorizing user!";
					socket.emit(responseEvent, res);
				}
			}
		);				
	});
	
	socket.on('activeUserRequest', function(data){
		responseEvent = 'activeUserResponse';		
		request.post(
			settings.serverAddress+'/user/active',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					user = JSON.parse(body);
					if(user.active){
						socket.userId = user.id;
						socket.join(user.roomId);															
						clients.set(socket.userId, socket);		
						error = false;
						res = new Object();
						res.error = error;
						res.data = user;
						//res.data = md5(res.data);
						socket.emit('activeUserResponse', res);
					}else{
						error = true;
						res = new Object();
						res.error = error;
						res.errorMessage = "Activation Code is incorrect!";	
						socket.emit('activeUserResponse', res);
					}
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during user activation!";									
					socket.emit('activeUserResponse', res);
				}
			}
		);		
	});		
	
	socket.on('leaveRoomRequest', function(data){
		responseEvent = 'leaveRoomResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}		
		data.userId = socket.userId;
		request.post(
			settings.serverAddress+'/room/remove_user_from_room',			
			{form : data},
			function (error, response, body) {
				if (!error && response.statusCode == 200) {	
					body = JSON.parse(body);					
					socket.leave(body.roomId);
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;		
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during removing user from room!";									
					socket.emit(responseEvent, res);
				}
			}
		);
	});	
	
	socket.on('editProfileRequest', function(data){		
		responseEvent = 'editProfileResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}							
		data.userId = socket.userId;											
		request.post(
			settings.serverAddress+'/user/edit_profile',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					user = JSON.parse(body);										
					error = false;
					res = new Object();
					res.error = error;
					res.data = user;	
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);											
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during editing user's profile!";									
					socket.emit(responseEvent, res);
				}
			}
		);		
	});		
	
	socket.on('logInRequest', function(data){
		responseEvent = 'logInResponse';
		request.post(
			settings.serverAddress+'/user/log_in',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {					
				    user = JSON.parse(body);	
					if(user.active){
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
										console.log(room.id);									
										socket.join(room.id);
									}	
								
									error = false;
									res = new Object();
									res.error = error;
									res.data = user;	
									//res.data = md5(res.data);
									socket.emit(responseEvent, res);								
								}else{				
									error = true;
									res = new Object();
									res.error = error;
									res.errorMessage = "An error occurred during log-in!";		
									socket.emit(responseEvent, res);
								}
							}
						);
					}else{
						error = false;
						res = new Object();
						res.error = error;
						res.data = {activationCode: user.activationCode};
						socket.emit(responseEvent, res);					
					}
				}else{					
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during log-in!";									
					socket.emit(responseEvent, res);
				}
			}
		);	
	});	
	
	socket.on('logOutRequest', function(data){		
		responseEvent = 'logOutResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}							
		data.userId = socket.userId;											
		request.post(
			settings.serverAddress+'/user/log_out',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					user = JSON.parse(body);	
					request.post(
						settings.serverAddress+'/user/get_rooms',
						{ form: {userId: user.id}},
						function (error, response, body){							
							if(!error && response.statusCode == 200){															
								body = JSON.parse(body);
								rooms = body.rooms;
								for(var i = 0 ; i < rooms.length; i++){
									room = rooms[i];	
									console.log(room.id);									
									socket.leave(room.id);
								}	
								socket.userId = null;
								clients.remove(user.id);								
								
								error = false;
								res = new Object();
								res.error = error;
								res.data = user;	
								//res.data = md5(res.data);
								socket.emit(responseEvent, res);								
							}else{				
								error = true;
								res = new Object();
								res.error = error;
								res.errorMessage = "An error occurred during log-out!";		
								socket.emit(responseEvent, res);
							}
						}
					);					
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during log-out!";									
					socket.emit(responseEvent, res);
				}
			}
		);		
	});		

	socket.on('addReviewRequest', function(data){
		responseEvent = 'addReviewResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}
		data.userId = socket.userId;		
		request.post(
			settings.serverAddress+'/review/add',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					body = JSON.parse(body);
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;		
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during adding review!";									
					socket.emit(responseEvent, res);
				}
			}
		);		
	});	
	
	socket.on('updateReviewRequest', function(data){
		responseEvent = 'updateReviewResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}
		data.userId = socket.userId;
		request.post(
			settings.serverAddress+'/review/update',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					body = JSON.parse(body);
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;		
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during updating review!";									
					socket.emit(responseEvent, res);
				}
			}
		);		
	});		
	
	socket.on('searchPlaceRequest', function(data){
		responseEvent = 'searchPlaceResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}		
		request.post(
			settings.serverAddress+'/place/search',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					body = JSON.parse(body);					
					places = body.places;
					error = false;
					res = new Object();
					res.error = error;
					res.data = places;	
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);											
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during searching place!";									
					socket.emit(responseEvent, res);
				}
			}
		);		
	});			
	
	socket.on('getBerimsRequest', function(data){
		responseEvent = 'getBerimsResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}						
		request.post(
			settings.serverAddress+'/room/get_berim',			
			{form : data},						
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					rooms = JSON.parse(body).rooms;					
					error = false;
					res = new Object();
					res.error = error;
					res.data = rooms;	
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during getting berims!";									
					socket.emit(responseEvent, res);
				}
			}
		);		
	});	
	
	socket.on('getMembersRequest', function(data){
		responseEvent = 'getMembersResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}						
		request.post(
			settings.serverAddress+'/room/get_member',			
			{form : data},						
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					users = JSON.parse(body).users;					
					for(var i = 0 ; i < users.length ; i++){
						user = users[i];						
						if(clients.has(user.id)){
							user.status = "online";
						}else{
							user.status = "offline";
						}						
					}
					error = false;
					res = new Object();
					res.error = error;
					res.data = users;	
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during getting berims!";									
					socket.emit(responseEvent, res);
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
					//res.data = md5(res.data);
					socket.emit('sendMessageResponse', res);
					delete msg.sender.password;
					//delete msg.sender.phoneNumber;					
					//console.log('before encryption : ');
					//console.log(msg);
					//msg = helpers.encryptMessage(md5, msg);
					receiver = msg.roomId;
					//msg = md5(msg);
					//console.log('after encryption : ');
					//console.log(msg);
					socket.in(receiver).emit('newMessage', msg);
					socket.in(msg.sender.roomId).emit('newMessage', msg);
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
					//res.data = md5(res.data);
					socket.emit('changeMessageStatusResponse', res);						
					//message = helpers.encryptMessage(md5, message);
					receiver = message.sender.roomId;
					delete message.sender.password;
					//message = md5(message);
					socket.in(receiver).emit('changeMessageStatus', message);
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
	
	socket.on('bulkChangeMessageStatusRequest', function(data){				
		responseEvent = 'bulkChangeMessageStatusResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}	
		request.post(
			settings.serverAddress+'/chat/bulk_change_message_status',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					body = JSON.parse(body);
					msgsMap = body.msgsMap;
					msgsMap = new HashMap(msgsMap);
					error = false;
					res = new Object();
					res.error = error;
					res.data = {message: 'Status of messages was changed!'};					
					//res.data = md5(res.data);
					socket.emit('bulkChangeMessageStatusResponse', res);											
					msgsMap.forEach(function(msgs, senderRoomId){																		
						//msgs = md5(msgs);					
						socket.in(senderRoomId).emit('bulkChangeMessageStatus', msgs);
					});
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during changing messages' status!";									
					socket.emit('bulkChangeMessageStatusResponse', res);
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
					//res.data = md5(res.data);
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
	
	socket.on('bulkChangeMessageStatusGotRequest', function(data){
		responseEvent = 'bulkChangeMessageStatusGotResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}
		request.post(
			settings.serverAddress+'/chat/bulk_change_message_status_got',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					body = JSON.parse(body);					
					error = false;
					res = new Object();
					res.error = error;
					res.data = {message: 'Ok!'};								
					//res.data = md5(res.data);
					socket.emit('bulkChangeMessageStatusGotResponse', res);						
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred during changing messages' update status!";									
					socket.emit('bulkChangeMessageStatusGotResponse', res);
				}
			}
		);		
	});		
	
	socket.on('typingRequest', function(data){
		responseEvent = 'typingResponse';
		if(!helpers.checkLogin(socket, responseEvent)){
			return;
		}
		data.userId = socket.userId;
		request.post(
			settings.serverAddress+'/user/get_user_info',
			{ form: data},
			function (error, response, body){							
				if(!error && response.statusCode == 200){	
					user = JSON.parse(body);						
					typing = {};
					typing.action = data.action;
					typing.user = user;
					socket.in(data.roomId).emit('typing', typing);
					
					error = false;
					res = new Object();
					res.error = error;
					res.data = {message: 'Ok!'};								
					//res.data = md5(res.data);
					socket.emit(responseEvent, res);						
				}else{				
					error = true;
					res = new Object();
					res.error = error;
					res.errorMessage = "An error occurred at server!";									
					socket.emit(responseEvent, res);
				}
			}
		);				
	});			
	
	socket.on('disconnect', function() {
		if(socket.userId != null){
			clients.remove(socket.userId);
			console.log(socket.userId+' leaved!');		
			data = {};
			data.userId = socket.userId;
			request.post(
				settings.serverAddress+'/user/update_last_seen',
				{ form: data},
				function (error, response, body){				
					user = JSON.parse(body);
					console.log(socket.userId+' last seen : '+user.lastSeen);
				}
			);			
		}
		numOfConnection.remove(socket.id);
    });	
	
	socket.on('getNumOfConRequest', function(){
		res = {};
		res.numOfConnection = numOfConnection.keys().length;
		socket.emit('getNumOfConResponse', res);
	})
	
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