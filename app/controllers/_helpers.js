
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
  }	
};
