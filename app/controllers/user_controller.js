var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					register: function (req, res, next) {					
						var params = _.pick(req.body, 'password', 'phoneNumber', 'nickName');
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
							  user = user.serialize();
							  console.log('user created!');
							  console.log(user);
							  // create a room for user
							  room = new Object();
							  room.name = user.nickName;
							  req.models.room.create(room, function(err, room){								
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
								room = room.serialize();
								console.log('room created!');
								//insert new user to his own room
								
							  });
							  
							  return res.send(200, user); 	  
						});
					},
					signIn: function (req, res, next){
						var params = _.pick(req.body, 'phoneNumber','password');	         
						req.models.user.find(params, function (err, users) {
							if(users.length==0)			
								//return res.send(401, { errors: helpers.formatErrors() });
								return res.send(401, "Error!");
							else
								user = users[0]
								return res.send(200, user.serialize());
      
						});
					}
				};
