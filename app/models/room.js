var moment = require('moment');

module.exports = function (orm, db) 
{
	var Room = db.define('room', {		
		name      : { type: 'text', required: true},
		placeId : { type: 'number'},
		maxUserCount : {type : 'number', defaultValue : 1},
		createDate : {type : 'date', time : true}		
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {						
						this.createDate = Date.now();
						return next();
					}
		}  ,	
		
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				name     : this.name,
				placeId  : this.placeId,
				maxUserCount : this.maxUserCount,
				createDate : this.createDate
				};
			}
		}
	}
	);
};
