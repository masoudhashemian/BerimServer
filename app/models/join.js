var moment = require('moment');

module.exports = function (orm, db) 
{
	var Join = db.define('join', {		
		userId      : { type: 'number', required: true},
		roomId : { type: 'number', required: true},
		date : {type : 'date', time : true}		
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {						
						this.date = Date.now();
						return next();
					}
		}  ,	
		
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				userId     : this.userId,
				roomId  : this.roomId,				
				date : this.date
				};
			}
		}
	}
	);
};
