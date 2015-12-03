var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					add: function (req, res, next) {					
						var params = _.pick(req.body, 'senderId', 'roomId', 'text');
						req.models.message.create(params, function (err, message) 
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
							  console.log('message added!');
							  console.log(message.serialize());
							  return res.send(200, message.serialize());  	  
						});
					},
					changeStatus: function(req, res, next){
						var params = _.pick(req.body, 'messageId', 'status');
						req.models.message.get(params.messageId, function (err, message) 
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
							  message.status = params.status;
							  message.save(function(err){
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
									req.models.user.get(message.senderId, function(err, user){
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
										data = new Object();
										data.message = message.serialize();									
										data.sender = user.serialize();
										return res.send(200, data);		
									});																															
								});						
						});						
					}
				};
