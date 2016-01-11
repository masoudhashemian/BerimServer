
var settings = require('../../config/settings');
var fs = require('fs');
var request = require('request');

module.exports = {
  checkLogin: function(socket,responseEvent) {
	console.log(socket.userId);
    if(socket.userId == null){
		// for development ease
		
		error = true;
		res = new Object();
		res.error = error;
		res.errorMessage = "Access is denied! You must log in.";		
		socket.emit(responseEvent, res);		
		return false;		
		
		//return true;
	}
	return true;
  },
  saveAttachment: function(data, userId){	
	file = data.file;
	if(file != null){
		ext = data.fileExt;				
		file = new Uint8Array(file);
		fileName = new Date().getTime() + '-' +  userId + '.'+ext;						
		fs.appendFileSync(settings.path+'/uploads/'+fileName, new Buffer(file));						
		return fileName;		
	}
  },
  loadAttachment: function(data){
	fileName = data.fileName;
	if(fileName != null){
		return fs.readFileSync(settings.path+'/uploads/'+fileName);
	}
  },
  encryptMessage: function(md5, msg){
	console.log('in encryption : ')
	for (var key in msg) {		
		if (msg.hasOwnProperty(key)) {
			console.log(key);
			console.log(msg[key]);
			msg[key] = md5(msg[key]);
		}
	}
	return msg;
  },
  sendSMS: function(receptor, message){	
	data = {};
	data.receptor = receptor;
	data.message = message;
	request.post(
		'https://api.kavenegar.com/v1/77424273765030664172636145517347754E456342773D3D/sms/send.json',
		{ form: data},
		function (error, response, body){							
			if(!error && response.statusCode == 200){	
				body = JSON.parse(body);					
				error = false;
				res = new Object();
				res.error = error;
				res.data = body;					
				console.log(res);
			}else{				
				error = true;
				res = new Object();
				res.error = error;
				res.errorMessage = "An error occurred during sending SMS!";									
				console.log(res);
			}
		}
	);			
  }
};
