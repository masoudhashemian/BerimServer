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
						if(params.messageId == null || params.status == null){
							return next("Message Id and Status must exist!");
						}
						req.models.message.get(params.messageId, function (err, message) 
						{
							  if(err || message == null) 
							  {
								return next("Message not found!");
							  }									  
							  message.status = params.status;
							  message.updateStatus = true;
							  message.save(function(err){
									if(err) 
									{
										return next("Error in saving message!");
									}									
									message = message.serialize();									
									return res.send(200, message);		
								});						
						});						
					},
					changeStatusGot: function(req, res, next){
						var params = _.pick(req.body, 'messageId');
						if(params.messageId == null){
							return next("Message Id must exist!");
						}
						req.models.message.get(params.messageId, function (err, message) 
						{
							  if(err || message == null) 
							  {
									return next("Message not found!");
							  }									  							  
							  message.updateStatus = false;
							  message.save(function(err){
									if(err) 
									{
										return next("Error in saving message!");
									}									
									message = message.serialize();									
									return res.send(200, message);																									
								});						
						});												
					},
					getChatList: function(req, res, next){
						var params = _.pick(req.body, 'userId', 'messageId');
						req.models.message.get(params.messageId, function(err, msg){
							if(msg == null){								
								return next("Message not found!");
							}							
							req.models.join.find({userId: params.userId}, function(err, joins){
								if(err){
									return next("Internal DB error!");
								}
								orStatement = [];
								for(var i = 0 ; i < joins.length ; i++){
									join = joins[i];
									join = join.serialize();
									orStatement.push({roomId : join.roomId});
								}								
								//$or : [{senderId : user._id}, {roomId : user.getRoomId()}]
								req.models.message.find({date: {$gt: msg.date}, $or : orStatement}, function(err, msgs){
									if(err){
										return next("Internal DB error!");
									}	
									msgList = [];
									for(var i = 0 ; i < msgs.length ; i++){
										msg = msgs[i];
										msg = msg.serialize();
										delete msg.sender.phoneNumber;
										delete msg.sender.password;
										msgList.push(msg);
									}
									data = {};
									data.msgs = msgList;
									return res.send(200, data);
								});
							});														
						});
					},
					getUpdatedStatusChatList: function(req, res, next){
						var params = _.pick(req.body, 'userId');
						if(params.userId == null){
							return next("userId must exist!");
						}						
						req.models.message.find({senderId : params.userId, updateStatus : true}, function(err, msgs){
							if(msgs == null){								
								return next("No message found!");
							}							
							msgList = [];
							for(var i = 0 ; i < msgs.length ; i++){
								msg = msgs[i];
								msg = msg.serialize();
								msgList.push(msg);
							}
							data = {};
							data.msgs = msgList;
							return res.send(200, data);
						});						
					}
				};
				
				
