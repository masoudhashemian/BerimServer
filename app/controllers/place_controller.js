var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					register: function (req, res, next) {							
						var params = _.pick(req.body, 'name', 'avatarAddress');
						req.models.place.create(params, function (err, place) 
						{
							  if(err) 
							  {
								helpers.reportErrors(res, next, err);
							  }
							  console.log('place created!');
							  console.log(place.serialize());
							  return res.send(200, place.serialize());  	  
						});
					},
					getList: function(req, res, next){
						req.models.place.find({}, function(err, places){
							if(err)
							{
								helpers.reportErrors(res, next, err);
							}
							for(var i = 0 ; i < places.length ; i++){
								places[i] = places[i].serialize();
							}
							console.log('found '+places.length+' places!');							
							data = {};
							data.places = places;
							return res.send(200, data);
						});
					}					
				};
