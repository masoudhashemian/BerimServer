var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					register: function (req, res, next) {					
						var params = _.pick(req.body, 'name');
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
					}
				};