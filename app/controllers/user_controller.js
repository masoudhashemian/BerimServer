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
								rooms.push(join.roomId);
							}			
							data = {};
							data.rooms = rooms;
							return res.send(200, data);
						});
					},
					getUserInfo: function(req, res, next){
						var params = _.pick(req.body, 'phoneNumber');
						req.models.user.find(params, function(err, users){		
							if(users.length==0)			
							{								
								return res.send(600, 'Phone number not found!');															
							}else{
								user = users[0];								
								console.log('user found!');
								console.log(user.serialize());	
								data = {};
								data.user = user.serialize();
								return res.send(200, data);
							}
						});						
					},
					searchUser: function(req, res, next){
						var params = _.pick(req.body, 'phoneNumber', 'nickName');
						req.models.user.find(params, function(err, users){		
							if(users.length==0)			
							{								
								return res.send(600, 'No user found!');															
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
					}
				};
