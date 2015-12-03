var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					register: function (req, res, next) {					
						var params = _.pick(req.body, 'name', 'placeId', 'maxUserCount');
						req.models.room.create(params, function (err, room) 
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
							  console.log('room created!');
							  console.log(room);
							  return res.send(200, room.serialize());  	  
						});
					}
				};