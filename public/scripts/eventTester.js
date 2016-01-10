socket = io();

firingEvents = [];
listeningEvents = [];

$(document).ready(function(){	
	$('#eventTesterForm').submit(function(e){
		e.preventDefault();
		fireEvent = $('#fireEvent').val();
		if(!fireEvent){
			fireEvent = 'dummy';
		}
		listenEvents = $('#listenEvent').val();
		if(!listenEvents){
			listenEvents = 'dummy';
		}else{
			listenEvents = listenEvents.split("-");
		}			
		trigger = $('#trigger').val();		
		
		if(fireEvent != 'dummy' && $.inArray(fireEvent, firingEvents) == -1){
			console.log('listening on : '+fireEvent+'Response');
			socket.on(fireEvent+'Response',function(res){			
				console.log(fireEvent+'Response');				
				console.log(res);
			});
			firingEvents.push(fireEvent);
		}
		if(listenEvents != 'dummy'){
			for(var i = 0 ; i < listenEvents.length ; i++){
				listenEvent = listenEvents[i];
				if($.inArray(listenEvent, listeningEvents) == -1){
					if(i==0){
						console.log('listening on : '+listenEvent+', with Trigger');
						socket.on(listenEvent, function(res){
							console.log(listenEvent);
							console.log(res);							
							eval(trigger);
						});
						listeningEvents.push(listenEvent);
					}else{
						console.log('listening on : '+listenEvent);
						socket.on(listenEvent, function(res){
							console.log(listenEvent);
							console.log(res);
						});
						listeningEvents.push(listenEvent);
					}			
				}
			}
		}	
		file = $('#uploadFile')[0].files[0];		
		stream = ss.createStream();
		//var reader = new FileReader();
		if(file != null){
		//	reader.readAsArrayBuffer(file);
			fireMessage = $('#fireMessage').val();
			if(fireMessage){
				fireMessage = JSON.parse(fireMessage);		
			}else{
				fireMessage = new Object();
			}		
			fireMessage.fileExt = 'jpeg';
			if(fireEvent != 'dummy'){				
				//socket.emit(fireEvent+'Request', fireMessage);		
				ss(socket).emit(fireEvent+'Request', stream, fireMessage);
				ss.createBlobReadStream(file).pipe(stream);
			}			
		}else{
			fireMessage = $('#fireMessage').val();
			if(fireMessage){
				fireMessage = JSON.parse(fireMessage);		
			}else{
				fireMessage = new Object();
			}
			if(fireEvent != 'dummy'){		
				if(fireEvent == 'sendMessage'){					
					ss(socket).emit(fireEvent+'Request', stream, fireMessage);		
				}else{
					socket.emit(fireEvent+'Request', fireMessage);		
				}
			}				
		}

		/*reader.onload = function(e) {
			var arrayBuffer = reader.result;
			fireMessage = $('#fireMessage').val();
			if(fireMessage){
				fireMessage = JSON.parse(fireMessage);		
			}else{
				fireMessage = new Object();
			}
			fireMessage.file = arrayBuffer;
			fireMessage.fileExt = 'jpeg';
			if(fireEvent != 'dummy'){				
				socket.emit(fireEvent+'Request', fireMessage);		
			}		
		}*/			
	});
});