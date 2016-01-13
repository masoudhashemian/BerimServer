
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
  }
};
