var moment = require('moment');

module.exports = function (orm, db) 
{
	var Message = db.define('message', {		
		senderId      : { type: 'number', required: true},
		roomId : { type: 'number', required: true},
		text : {type: 'text', required: true},
		status : {type: 'text', defaultValue: 'deliverAtServer'},				
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
				senderId     : this.senderId,
				roomId       : this.roomId,
				text         : this.text,
				status       : this.status,
				date         : this.date
				};
			}
		}
	}
	);
};
