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
										console.log('in controller');
										console.log(data.message);
										data.sender = user.serialize();
										return res.send(200, data);		
									});																															
								});						
						});						
					},
					getChatList: function(req, res, next){
						var params = _.pick(req.body, 'userId', 'messageId');
						req.models.message.get(params.messageId, function(err, msg){
							if(err)
							{
								helpers.reportErrors(res, next, err);
							}							
							req.models.user.get(params.userId, function(err, user){
								if(err){
									helpers.reportErrors(res, next, err);
								}
								console.log(msg.serialize());
								console.log(user.serialize());
								req.models.message.find({date: {$gt: msg.date}, $or : [{senderId : user._id}, {roomId : user.getRoomId()}]}, function(err, msgs){
									if(err){
										helpers.reportErrors(err);
									}									
									return res.send(200, msgs);
								});
							});							
						});
					}
				};
				
				
