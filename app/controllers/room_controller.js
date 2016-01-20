var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					register: function (req, res, next) {					
						var params = _.pick(req.body, 'name', 'placeId', 'maxUserCount', 'userId');						
						req.models.room.create({name: params.name, placeId: params.placeId, maxUserCount: params.maxUserCount}, function (err, room) 
						{
							  if(err) 
							  {
								return next("DB internal error!");
							  }
							  console.log('room created!');
							  console.log(room.serialize());
							  //insert creator to the room
							  newJoin = {};
							  newJoin.userId = params.userId;
							  newJoin.roomId = room._id;
							  req.models.join.create(newJoin, function(err, join){
								if(err){
									return next("DB internal error!");
								}
								console.log('join created!')
								console.log(join.serialize());
								return res.send(200, room.serialize());  	  
							  });							  
						});
					},
					addUser: function(req, res, next){
						var params = _.pick(req.body, 'userId', 'roomId', 'actorId');
						req.models.join.find({roomId : params.roomId, userId: params.actorId}, function(err, joins){
							if(err){
								return next("DB internal error");
							}
							if(joins.length == 0 && params.userId != params.actorId){
								return next("Access is denied!");
							}
							req.models.join.create({roomId: params.roomId, userId: params.userId}, function(err, join){
								if(err)
								{
									helpers.reportErrors(res, next, err);
								}
								try{								
									return res.send(200, join.serialize());
								}catch(err){
									return res.send(600, "An error occurred during joining user to room!");
								}
							});
						});						
					},
					removeUser: function(req, res, next){
						var params = _.pick(req.body, 'userId', 'roomId');
						req.models.join.find(params, function(err, joins){
							if(err || joins.length == 0)
							{
								return next('DB internal error!');
							}
							join = joins[0];
							data = join;
							join.remove(function(err){});												
							return res.send(200, data.serialize());
						});
					},
					getBerim: function(req, res, next){
						var params = _.pick(req.body, 'placeId');
						if(params.placeId == null){
							return next("Place ID must exist!");
						}
						req.models.room.find(params, function(err, rooms){
							if(err){
								return next("DB internal error!");
							}							
							for(var i = 0 ; i < rooms.length ; i++){
								rooms[i] = rooms[i].serialize();
							}
							result = {};
							result.rooms = rooms;
							return res.send(200, result);
						});
					},
					getMember: function(req, res, next){
						var params = _.pick(req.body, 'roomId');
						if(params.roomId == null){
							return next("Room ID must exist!");
						}
						req.models.join.find(params, function(err, joins){
							if(err){
								return next("DB internal error!");
							}							
							users = [];
							for(var i = 0 ; i < joins.length ; i++){
								join = joins[i].serialize();
								users.push(join.user);
							}
							result = {};
							result.users = users;
							return res.send(200, result);
						});
					}
				};
