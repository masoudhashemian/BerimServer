var request = require('request');

module.exports = {
  formatErrors: function(errorsIn) {
    var errors = {};
    var a, e;

    for(a = 0; a < errorsIn.length; a++) {
      e = errorsIn[a];

      errors[e.property] = errors[e.property] || [];
      errors[e.property].push(e.msg);
    }
    return errors;
  },
  reportErrors: function(res, next, err){				
		if(Array.isArray(err))
		{
			console.log({errors: this.formatErrors(err) });
			return res.send(600, {errors: this.formatErrors(err) });
		}
		else 
		{
			return next(err);
		}
  },
  hasValidExtention: function(type){
	allowed = [];
	allowed.push('image/png');
	allowed.push('image/gif');
	allowed.push('image/jpeg');
	allowed.push('video/3gpp');
	allowed.push('video/x-msvideo');
	allowed.push('video/x-flv');
	allowed.push('video/x-ms-wmv');
	allowed.push('video/mpeg');
	allowed.push('video/mp4');
	allowed.push('application/pdf');
	allowed.push('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
	allowed.push('application/vnd.openxmlformats-officedocument.wordprocessingml.template');
	allowed.push('application/msword');
	allowed.push('application/zip');
	allowed.push('application/x-rar-compressed');
	console.log(type);
	if(allowed.indexOf(type) > -1){
		return true;
	}
	return false;
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
