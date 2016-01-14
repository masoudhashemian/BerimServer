var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					add: function (req, res, next) {					
						var params = _.pick(req.body, 'userId', 'placeId', 'text', 'rate');						
						if(params.userId == null || params.placeId == null){
							return next('User ID and place ID must exist!');
						}
						if(params.rate == null){						
							params.rate = -1;
						}												
						req.models.review.create(params, function (err, review) 
						{
							  if(err) 
							  {
								return next('DB internal error!');
							  }
							  console.log('review created!');
							  console.log(review.serialize());
							  return res.send(200, review.serialize());  	  
						});
					},
					update: function(req, res, next){
						var params = _.pick(req.body, 'reviewId', 'text', 'rate', 'userId');
						if(params.reviewId == null || params.userId == null){
							return next('Review ID and user ID must exist!');
						}
						req.models.review.get(params.reviewId, function (err, review) 
						{
							  if(err) 
							  {
								return next('DB internal error!');
							  }
							  if(review.userId != params.userId){
								return next("Access is denied!");
							  }
							  if(params.text != null){
								review.text = params.text;
							  }							  
							  if(params.rate != null){
								review.rate = params.rate;
							  }			
							  review.save(function(err){
								return res.send(200, review.serialize());
							  });							  
						});
					}					
				};
