 var socket = io('');
 
 $(document).ready(function () {	
 
  $('form').submit(function(){
    var message = new Object();
	message.text = $('#m').val();	
	message.to = $('#to').val();
    socket.emit('sendMessageRequest', message);
    $('#m').val('');	
    return false;
  });	
  socket.on('sendMessageResponse', function(msg){    
    $('#messages').append($('<li>').text(msg.from+' : '+msg.text));
  });  
  socket.on('new user', function(msg){
	$('#messages').append($('<li>').text(msg));
  });  
  socket.on('get history', function(docs){
	for (i = 0; i < docs.length; i++) { 
    $('#messages').append($('<li>').text(docs[i].text));
	}
  }); 
	
	$('#signIn').submit(function (e) {		
		var data = $('#signIn').serializeObject();
		socket.emit('signInRequest', data);
		return false;
	});
	
	socket.on('signInResponse', function(res){	    
		if(res.error){
			alert(res.errorMessage);
		}else{					
		data = res.data;
		$('.signInForm').hide();			
		$('.chat').show();
		socket.emit('getOnlineUsersRequest');
		var password = data.password;
		var phoneNumber = data.phoneNumber;
		}
	});
	
	socket.on('getOnlineUsersResponse', function(res){		
		if(res.error){
			alert(res.errorMessage);
		}else{					
		users = res.data;	
		for(var i = 0 ; i < users.length; i++){										
			$('#users').append($('<li class="user">').text(users[i]));
			$('.user').click(function(){				
				$('#to').val($(this).text());
				$('.chat p').text($(this).text());
			})
		}			
		
	});
	
});

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};