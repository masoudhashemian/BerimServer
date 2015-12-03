
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
				    body = JSON.parse(body);					
					socket.userId = body.id;
					socket.join(socket.userId);					
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;
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
	});	
	
	socket.on('signInRequest', function(data){	
		request.post(
			'http://localhost:'+settings.port+'/user/sign_in',
			{ form: data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {					
				    body = JSON.parse(body);					
					socket.userId = body.id;
					socket.join(socket.userId);
					error = false;
					res = new Object();
					res.error = error;
					res.data = body;
					socket.emit('signInResponse', res);
				}else{					
					data.err = body;
					data.status = response.statusCode;	
					socket.emit('signInResponse', data);
				}
			}
		);	
	});
	
	
	//events
	socket.on('sendMessageRequest', function(msg){	
		console.log(msg);
		console.log(msg.to);
		var receiver = msg.to;
		msg.from = socket.userId;
		console.log(msg);
		io.sockets.in(receiver).emit('sendMessageResponse', msg);		
	});
	
	socket.on('disconnect', function() {
		delete clients[socket.id];
        console.log(socket.id+' leaved!');		
    });	
	
	socket.on('getOnlineUsersRequest', function(){				
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