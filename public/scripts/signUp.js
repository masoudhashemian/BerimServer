var socket = io();

$(document).ready(function () {	
	$('#signUp').submit(function (e) {						
		var data = $('#signUp').serializeObject();				
		socket.emit('signUpRequest', data);
		return false;				
	});
	
	socket.on('signUpResponse', function(res){		
		console.log(res);
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