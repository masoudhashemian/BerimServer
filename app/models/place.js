var moment = require('moment');
var settings = require('../../config/settings');

module.exports = function (orm, db) 
{
	var Place = db.define('place', {		
		name       : { type: 'text'},
		address    : { type: 'text'},
		latitude   : { type: 'number'},
		longitude : { type: 'number'},		
		avatar     : { type : 'text'},
		category   : { type: 'text'},
		description : { type : 'text'},
		reviews    : { type: 'object'},
		rate       : { type: 'number'},
		lastUpdate : { type: 'date', time : true}
	},
		
	{   		
		 hooks: {
					beforeCreate: function (next) {						
						obj = this;
						obj.rate = -1;
						temp = {};
						temp.reviews = [];
						obj.reviews = temp;
						if(obj.avatar == null){
							obj.avatar = settings.serverAddress+'/avatars/?fileName=default-place-avatar.png';						
						}
						/*if(obj.category == null){
							obj.category = "unknown";
						}
						if(obj.longitude == null){
							obj.longitude = 0;
						}
						if(obj.latitude == null){
							obj.latitude = 0;
						}
						if(obj.address == null){
							obj.address = "unknown";
						}
						if(obj.name == null){
							obj.name = "unknown";
						}*/
						return next();
					},
					beforeSave: function(next){
						this.lastUpdate = Date.now();
						return next();
					}
		}  ,
		
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				name         : this.name,				
				address      : this.address,
				latitude     : this.latitude,
				longitude   : this.longitude,
				avatar       : this.avatar,
				category     : this.category,
				description  : this.description,
				reviews      : this.reviews.reviews,	
				rate         : this.rate
				};
			}
		}
	}
	);
};
