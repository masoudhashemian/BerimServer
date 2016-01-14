var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					register: function (req, res, next) {								
						var params = _.pick(req.body, 'password', 'phoneNumber', 'nickName');
						console.log(req.body);
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
							  console.log('user created!');
							  console.log(user);
							  // create a room for user
							  newRoom = new Object();
							  newRoom.name = user.nickName;
							  req.models.room.create(newRoom, function(err, room){								
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
								console.log('room created!');
								console.log(room.serialize());	
								user.room = room;
								user.save();
								//insert new user to his own room								
								newJoin = new Object();
								newJoin.userId = user._id;
								newJoin.roomId = room._id;
								req.models.join.create(newJoin, function(err, join){
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
									console.log('join created!');
									console.log(join.serialize());
									
									return res.send(200, user.serialize());
								});
							  });							  							  
						});
					},
					signIn: function (req, res, next){
						var params = _.pick(req.body, 'phoneNumber','password');
						if(params.phoneNumber == null || params.password == null){
							return next("Password or Phone number must exist!");
						}
						req.models.user.find(params, function (err, users) {
							if(users.length==0)			
							{								
								return res.send(600, 'Password or Phone number is incorrect!');															
							}else{
								user = users[0];								
								console.log('user found!');
								console.log(user.serialize());								
								return res.send(200, user.serialize());
							}
						});
					},
					getRooms: function(req, res, next){
						var params = _.pick(req.body, 'userId');
						req.models.join.find(params, function(err, joins){														
							var rooms = new Array();
							for(var i = 0; i < joins.length; i++){
								join = joins[i];										
								rooms.push(join.room);
							}			
							data = {};
							data.rooms = rooms;
							return res.send(200, data);
						});
					},
					getUserInfo: function(req, res, next){
						var params = _.pick(req.body, 'phoneNumber', 'userId');
						if(params.phoneNumber == null && params.userId == null){
							return next('Phone number or user ID must exist!');
						}
						if(params.phoneNumber){
							req.models.user.find(params, function(err, users){		
								if(err){
									return next('DB internal error!');
								}
								if(users.length==0)			
								{								
									return next('Phone number not found!');															
								}else{
									user = users[0];								
									console.log('user found!');
									console.log(user.serialize());	
									return res.send(200, user.serialize());
								}
							});
						}else{
							req.models.user.get(params.userId, function(err, user){		
								if(user == null)			
								{								
									return res.send(600, 'User ID not found!');															
								}else{													
									console.log('user found!');
									console.log(user.serialize());	
									return res.send(200, user.serialize());
								}
							});							
						}
					},
					searchUser: function(req, res, next){
						var params = _.pick(req.body, 'query');
						req.models.user.find({$or:[{phoneNumber:{$regex: params.query}},{nickName:{$regex: params.query}}]}, function(err, users){		
							if(users == null)			
							{								
								return res.send(600, 'Error in DB!');					
							}else{
								for(var i = 0 ; i < users.length ; i++){
									users[i] = users[i].serialize();
								}
								console.log(users.length + ' users found!');								
								data = {};
								data.users = users;
								return res.send(200, data);
							}
						});						
					},
					updateLastSeen: function(req, res, next){
						var params = _.pick(req.body, 'userId');
						req.models.user.get(params.userId, function(err, user){		
							if(user == null)			
							{								
								return res.send(600, 'No user found!');															
							}else{
								user.lastSeen = Date.now();								
								user.save();
								return res.send(200, user.serialize());
							}
						});						
					},
					setAvatar: function(req, res, next){
						var params = _.pick(req.body, 'userId', 'avatarAddress');
						req.models.user.get(params.userId, function(err, user){		
							if(user == null)			
							{								
								return res.send(600, 'No user found!');															
							}else{
								user.avatarAddress = params.avatarAddress;	
								user.save(function(err){
									return next('An error occured during saving avatar address of user!');
								});
								return res.send(200, user.serialize());
							}
						});						
					},
					active: function(req, res, next){
						var params = _.pick(req.body, 'phoneNumber', 'deviceId', 'activationCode');
						if(params.phoneNumber == null || params.deviceId == null || params.activationCode == null){
							return next('Phone number, device ID and activation code must exist!');
						}
						req.models.userLogIn.find({phoneNumber: params.phoneNumber, deviceId: params.deviceId}, function(err, userLogIns){		
							if(err)			
							{								
								return next('DB internal error!');
							}else{								
								if(userLogIns.length == 0){
									return next('No userLogIn found!');
								}
								userLogIn = userLogIns[0];
								req.models.user.find({phoneNumber: params.phoneNumber}, function(err, users){		
									if(err){																
										return next('DB internal err')
									}else{
										if(users.length == 0){
											return next('No user found!');
										}
										user = users[0];
										user = user.serialize();
										if(params.activationCode == userLogIn.activationCode){
											userLogIn.active = true;									
											userLogIn.save();
										}
										user.active = userLogIn.active;
										return res.send(200, user);
									}
								});																									
							}
						});						
					},
					editProfile: function(req, res, next){
						var params = _.pick(req.body, 'userId', 'avatarAddress', 'nickName');
						req.models.user.get(params.userId, function(err, user){		
							if(user == null)			
							{								
								return res.send(600, 'No user found!');															
							}else{
								if(params.avatarAddress != null){
									user.avatarAddress = params.avatarAddress;	
								}
								if(params.nickName != null){
									user.nickName = params.nickName;	
								}
								user.save(function(err){});
								return res.send(200, user.serialize());
							}
						});						
					},
					logIn: function(req, res, next){
						var params = _.pick(req.body, 'phoneNumber', 'deviceId');
						if(params.phoneNumber == null || params.deviceId == null){
							return next('Phone number and device ID must exist!');
						}	
						req.models.user.find({phoneNumber: params.phoneNumber}, function(err, users){		
							if(err || users == null)			
							{								
								return res.send(600, 'DB internal error!');															
							}else{
								if(users.length == 0){
									req.models.user.create({phoneNumber: params.phoneNumber}, function (err, user){
										if(err){
											return next('DB internal error!');
										} 
										console.log('user created!');
										console.log(user);
										// create a room for user
										newRoom = new Object();										
										req.models.room.create(newRoom, function(err, room){								
											if(err){
												return next('DB internal error!');												
											}
											console.log('room created!');
											console.log(room.serialize());	
											user.room = room;
											user.save();
											//insert new user to his own room								
											newJoin = new Object();
											newJoin.userId = user._id;
											newJoin.roomId = room._id;
											req.models.join.create(newJoin, function(err, join){
												if(err){
													return next('DB internal error!');
												}							
												console.log('join created!');
												console.log(join.serialize());																
											});
										});					
										//insert new userLogIn
										newUserLogIn = {};
										newUserLogIn.phoneNumber = user.phoneNumber;
										newUserLogIn.deviceId = params.deviceId;
										req.models.userLogIn.create(newUserLogIn, function(err, userLogIn){
											if(err){
												console.log(err);
												return next('DB internal error!');
											}							
											console.log('userLogIn created!');
											console.log(userLogIn.serialize());
											user = user.serialize();
											user.active = userLogIn.active;
											user.activationCode = userLogIn.activationCode;
											receptor = user.phoneNumber;
											message = "Your activation code is : "+user.activationCode;
											//result = helpers.sendSMS(receptor, message);
											console.log('send sms result : ');
											console.log(message);
											return res.send(200, user);
										});										
									});									
								}else{
									user = users[0];
									req.models.userLogIn.find(params, function(err, userLogIns){		
										if(err){								
											return res.send(600, 'DB internal error!');	
										}else{
											if(userLogIns.length == 0){
												//insert new userLogIn
												newUserLogIn = {};
												newUserLogIn.phoneNumber = user.phoneNumber;
												newUserLogIn.deviceId = params.deviceId;
												req.models.userLogIn.create(newUserLogIn, function(err, userLogIn){
													if(err){
														return next('DB internal error!');
													}							
													console.log('userLogIn created!');
													console.log(userLogIn.serialize());
													user = user.serialize();
													user.active = userLogIn.active;
													user.activationCode = userLogIn.activationCode;
													receptor = user.phoneNumber;
													message = "Your activation code is : "+user.activationCode;
													//result = helpers.sendSMS(receptor, message);
													console.log('send sms result : ');
													console.log(message);
													return res.send(200, user);												
												});
											}else{
												userLogIn = userLogIns[0];
												if(!userLogIn.active){
													newActivationCode = Math.round(Math.random()*10000);
													userLogIn.activationCode = newActivationCode;
													userLogIn.save();
													user = user.serialize();
													user.active = userLogIn.active;
													user.activationCode = userLogIn.activationCode;
													receptor = user.phoneNumber;
													message = "Your activation code is : "+user.activationCode;
													//result = helpers.sendSMS(receptor, message);
													console.log('send sms result : ');
													console.log(message);
													return res.send(200, user);																								
												}else{
													user = user.serialize();
													user.active = userLogIn.active;
													return res.send(200, user);
												}
											}								
										}	
									});						
								}
							}
						});												
					},
					logOut: function(req, res, next){
						var params = _.pick(req.body, 'phoneNumber', 'deviceId');
						if(params.phoneNumber == null || params.deviceId == null){
							return next('Phone number and device ID must exist!');
						}
						req.models.userLogIn.find({phoneNumber: params.phoneNumber, deviceId: params.deviceId}, function(err, userLogIns){	
							if(err)			
							{								
								return next('DB internal error!');
							}else{
								if(userLogIns.length == 0){
									return next('No userLogIn found!');
								}
								userLogIn = userLogIns[0];
								userLogIn.active = false;
								userLogIn.save();
								req.models.user.find({phoneNumber: params.phoneNumber}, function(err, users){		
									if(err){																
										return next('DB internal err')
									}else{
										if(users.length == 0){
											return next('No user found!');
										}
										user = users[0];
										user.lastSeen = Date.now();	
										user.save();
										user = user.serialize();
										user.active = userLogIn.active;
										return res.send(200, user);
									}
								});																	
							}
						});						
					},
					resendActivationCode: function(req, res, next){
						var params = _.pick(req.body, 'phoneNumber', 'deviceId');
						if(params.phoneNumber == null || params.deviceId == null){
							return next('Phone number and device ID must exist!');
						}
						req.models.userLogIn.find({phoneNumber: params.phoneNumber, deviceId: params.deviceId}, function(err, userLogIns){	
							if(err)			
							{								
								return next('DB internal error!');
							}else{
								if(userLogIns.length == 0){
									return next('No userLogIn found!');
								}
								userLogIn = userLogIns[0];								
								req.models.user.find({phoneNumber: params.phoneNumber}, function(err, users){		
									if(err){																
										return next('DB internal err')
									}else{
										if(users.length == 0){
											return next('No user found!');
										}
										user = users[0];
										user = user.serialize();
										user.active = userLogIn.active;
										user.activationCode = userLogIn.activationCode;										
										receptor = user.phoneNumber;
										message = "Your activation code is : "+user.activationCode;
										//result = helpers.sendSMS(receptor, message);
										console.log('send sms result : ');
										console.log(message);
										return res.send(200, user);
									}
								});																	
							}
						});						
					}					
				};
