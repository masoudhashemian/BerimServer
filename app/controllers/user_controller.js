var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					register: function (req, res, next) {					
						var params = _.pick(req.body, 'password', 'phoneNumber');
						req.models.user.create(params, function (err, user) 
						{
							  if(err) 
							  {
									if(Array.isArray(err))
									{
									  console.log({errors: helpers.formatErrors(err) });
									  return res.send(600, {errors: helpers.formatErrors(err) });
									}
									else 
									{
									  return next(err);
									}
							  }
							  
							  return res.send(200, user.serialize());  	  
						});
					},
					signIn: function (req, res, next){
						var params = _.pick(req.body, 'phoneNumber','password');	         
						req.models.user.find({phoneNumber: params.phoneNumber,password: params.password}, function (err, user) {
							if(user.length==0)			
								//return res.send(401, { errors: helpers.formatErrors() });
								return res.send(401, "Error!");
							else
								return res.send(200, user.phoneNumber);
      
						});
					}

				};