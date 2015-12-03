socket = io();

$(document).ready(function(){
	$('#eventTesterForm').submit(function(){
		fireEvent = $('#fireEvent').val();
		if(!fireEvent){
			fireEvent = 'dummy';
		}
		listenEvent = $('#listenEvent').val();
		if(!listenEvent){
			listenEvent = 'dummuy';
		}
		message = $('#message').val();
		if(message){
			message = JSON.parse(message);		
		}else{
			message = new Object();
		}
		console.log('listening on : '+fireEvent+'Response');
		socket.on(fireEvent+'Response',function(res){			
			if(fireEvent=='signIn' || fireEvent=='signUp'){				
				if(!res.error){
					$('#userId').val(res.data.id);
				}
			}
			console.log(fireEvent+'Response');
			console.log(res);
		});		
		console.log('listening on : '+listenEvent+'Request');
		socket.on(listenEvent+'Request', function(res){
			console.log(listenEvent+'Response');
			console.log(res);
		});
		userId = $('#userId').val();
		if(userId){
			message.userId = userId;
		}
		console.log('firing : '+fireEvent+'Request');
		socket.emit(fireEvent+'Request', message);
		return false;
	});
});