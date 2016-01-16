var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');
var HashMap = require('hashmap');

module.exports ={
					add: function (req, res, next) {					
						var params = _.pick(req.body, 'senderId', 'roomId', 'text', 'file');
						req.models.message.create(params, function (err, message) 
						{
							  if(err || message == null) 
							  {
								return next("Message can not be added!");
							  }								 							  
							  console.log('message added!');
							  console.log(message.serialize());
							  req.models.join.find({roomId: message.roomId}, function(err, joins){
								if(err){
									return next("DB error!");									
								}
								if(joins.length > 0){
									for(var i = 0 ; i < joins.length ; i++){
										join = joins[i];
										if(join.userId != message.senderId){
											join.lastMessage = message.serialize();										
											join.save();
										}
									}
								}
							  });
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
					bulkChangeStatus: function(req, res, next){		
						var params = _.pick(req.body, 'messages', 'status');
						if(params.messages == null || params.messages.length == 0 || params.status == null){
							return next("Messages and Status must exist!");
						}												
						msgsMap = new HashMap();						
						req.models.message.find({_id:params.messages}, function (err, msgs){
							if(err || msgs == null || msgs.length == 0) 
							{
								return next("Message not found!");
							}
							for(var i = 0 ; i < msgs.length ; i++){
								message = msgs[i];								
								message.status = params.status;
								message.updateStatus = true;
								if(msgsMap.has(message.sender.roomId)){
									msgsMap.get(message.sender.roomId).push(message.serialize());
								}else{
									temp = [];
									temp.push(message.serialize());
									msgsMap.set(message.sender.roomId,temp);
								}
								message.save(function(err){
									if(err) 
									{
										return next("Error in saving message!");
									}											
								});						
							}										
							data = {};
							data.msgsMap = msgsMap;
							return res.send(200, data);
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
					bulkChangeStatusGot: function(req, res, next){
						var params = _.pick(req.body, 'messages');
						if(params.messages == null || params.messages.length == 0){
							return next("Messages' Id must exist!");
						}
						req.models.message.find({_id: params.messages}, function (err, messages) 
						{
							  if(err || messages == null || messages.length == 0) 
							  {
									return next("Message not found!");
							  }									  				
							  for(var i = 0 ; i < messages.length ; i++){
								message = messages[i];
								message.updateStatus = false;								
								messages[i] = message.serialize();
								message.save(function(err){
									if(err) 
										{
											return next("Error in saving message!");
										}									
									});						
							  }
							  return res.send(200, messages);
						});												
					},					
					getChatList: function(req, res, next){
						var params = _.pick(req.body, 'userId', 'messageId');
						req.models.message.get(params.messageId, function(err, msg){
							if(msg == null){								
								//return next("Message not found!");
								msg = {};
								msg.date = 0;
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
								orStatement.push({senderId : params.userId});
								console.log(orStatement);
								console.log(msg.date);
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
								//msg.updateStatus = false;
								msgList.push(msg.serialize());
								/*msg.save(function(err){
									return next('An error aoccured during saving message!');
								});*/
							}
							data = {};
							data.msgs = msgList;
							return res.send(200, data);
						});						
					}
				};
				
				
