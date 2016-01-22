var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');
var HashMap = require('hashmap');

module.exports ={
					register: function (req, res, next) {							
						var params = _.pick(req.body, 'name', 'address', 'latitude', 'longitude', 'avatar', 'category', 'description');
						console.log(params);
						req.models.place.create(params, function (err, place) 
						{
							  if(err) 
							  {
								return next("DB internal error!");
							  }
							  console.log('place created!');
							  console.log(place.serialize());
							  return res.send(200, place.serialize());  	  
						});
					},
					getList: function(req, res, next){
						req.models.place.find({}, ['lastUpdate', 'Z'],function(err, places){
							if(err){
								return next('DB internal error!');
							}								
							for(var i = 0 ; i < places.length ; i++){
								places[i] = places[i].serialize();									
							}
							console.log('found '+places.length+' places!');							
							data = {};
							data.places = places;
							return res.send(200, data);											
						});
					},
					search: function(req, res, next){
						var params = _.pick(req.body, 'name', 'category', 'latitude', 'longitude', 'radius');
						if(params.name != null || params.category != null){
							orStatement = [];
							if(params.name != null){
								orStatement.push({name: {$regex : params.name}});
							}
							if(params.category != null){
								orStatement.push({category: {$regex: params.category}});
							}
							req.models.place.find({$or : orStatement},function(err, places){
								if(err){
									return next("DB internal error!");
								}
								for(var i = 0 ; i < places.length ; i++){
									place = places[i];
									places[i] = place.serialize();
								}
								data = {};
								data.places = places;
								return res.send(200, data);
							});
						}
						else if(params.latitude !=  null && params.longitude != null && params.radius != null){
							req.models.place.find({},function(err, places){
								if(err){
									return next("DB internal error!");
								}
								selectedPlaces = [];
								for(var i = 0 ; i < places.length ; i++){
									place = places[i];
									if(place.latitude == null || place.longitude == null){
										continue;
									}
									dist = helpers.getDistanceFromLatLonInKm(Number(params.latitude), Number(params.longitude), Number(place.latitude), Number(place.longitude));									
									console.log(place.name+' dist : '+dist);
									if(dist <= params.radius){
										selectedPlaces.push(place.serialize());
									}
								}
								data = {};
								data.places = selectedPlaces;
								return res.send(200, data);
							});							
						}
						else{
							return next("No enough input!");
						}
					}
				};
