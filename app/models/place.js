var moment = require('moment');
var settings = require('../../config/settings');

module.exports = function (orm, db) 
{
	var Place = db.define('place', {		
		name       : { type: 'text'},
		address    : { type: 'text'},
		latitude   : { type: 'number'},
		longtitude : { type: 'number'},		
		avatar     : { type : 'text'},
		category   : { type: 'text'},
		rate       : { type: 'number'}
	},
		
	{   		
		 hooks: {
					beforeCreate: function (next) {						
						obj = this;
						obj.rate = -1;
						if(obj.avatar == null){
							obj.avatar = settings.serverAddress+'/avatars/?fileName=default-place-avatar.png';						
						}
						/*if(obj.category == null){
							obj.category = "unknown";
						}
						if(obj.longtitude == null){
							obj.longtitude = 0;
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
				longtitude   : this.longtitude,
				avatar       : this.avatar,
				category     : this.category,
				rate         : this.rate
				};
			}
		}
	}
	);
};
