 $(document).ready(function () {	
	
	$('#signIn').submit(function (e) {		
		var data = $('#signIn').serializeObject();
		socket.emit('signIn', data);
		return false;
	});
	
	socket.on('signInResponse', function(data){	    
		$('.signInForm').hide();			
		$('.chat').show();
		socket.emit('getOnlineUsers');
		var password = data.password;
		var phoneNumber = data.phoneNumber;
		//alert('Dear user, you have signed in sucessfully, password : '+password+', phone number : '+phoneNumber);
	});
	
	socket.on('signInResponse', function(data){
		$('.signInForm').hide();		
		var err = data.err;
		var status = data.status;
		alert('Failed! Error : '+err+' , status : '+status);
	});	
	
	socket.on('onlineUser', function(users){
		alert(users.length);
		for(var i = 0 ; i < users.length; i++){							
			//alert(users[i].phoneNumber);
			$('#users').append($('<li id="user">').text(users[i].phoneNumber));
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