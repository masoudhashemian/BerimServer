var moment = require('moment');

module.exports = function (orm, db) 
{
	var review = db.define('review', {		
		userId      : { type : 'number', required: true},
		user        : { type : 'object'},
		placeId     : { type : 'number', required: true},
		//place       : { type : 'object'},
		date        : { type : 'date', time : true},
		text        : { type : 'text'},
		rate        : { type : 'number'}		
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {						
						obj = this;						
						db.models.review.find({placeId : obj.placeId, userId: obj.userId}, function(err, repeatedReviews){
							if(err){
								return next("Internal DB error!");
							}
							if(repeatedReviews.length > 0 ){
								return next("Repeated review!");
							}
							db.models.user.get(obj.userId, function(err, user){
								obj.user = user.serialize();
								return next();
								/*db.models.place.get(obj.placeId, function(err, place){
									obj.place = place.serialize();
										return next();
								});	*/
							});													
						});						
					},
					beforeSave: function(next){
						obj = this;						
						obj.date = Date.now();												
						db.models.place.get(obj.placeId, function(err, place){
							db.models.review.find({placeId : obj.placeId}, function(err ,reviews){
								if(err){
									return next("Internal DB error!");
								}				
								update = false;
								numOfNeutral = 0;								
								if(obj.rate != -1){									
									sum = Number(obj.rate);
								}else{
									sum = 0;
									numOfNeutral++;
								}								
								for(var i = 0 ; i < reviews.length ; i++){								
									review = reviews[i];
									if(review._id == obj._id){
										update = true;
										continue;
									}
									if(review.rate == -1){
										numOfNeutral++;
										continue;
									}
									sum += Number(review.rate);
								}
								length = reviews.length - numOfNeutral;
								if(update){
									avg = sum / length;
								}else{
									avg = sum /(length+1);
								}							
								place.rate = avg;
								place.save();
								//obj.place = place;
								return next();
							});
						});
					}
		}  ,		
		
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				userId       : this.userId,
				placeId      : this.placeId,	
				user         : this.user,
				//place        : this.place,
				date         : this.date,
				text         : this.text,
				rate         : this.rate
				};
			}
		}
	}
	);
};
