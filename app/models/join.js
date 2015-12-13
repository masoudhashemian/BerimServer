var moment = require('moment');

module.exports = function (orm, db) 
{
	var Join = db.define('join', {		
		userId      : { type : 'number', required: true},
		user        : { type : 'object'},
		roomId      : { type : 'number', required: true},
		room        : { type : 'object'},
		date        : { type : 'date', time : true}		
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {						
						obj = this;
						obj.date = Date.now();
					//	db.models.user.get(obj.userId, function(err, user){
						//	obj.user = user;
						//	db.models.room.get(obj.roomId, function(err, room){
							//	obj.room = room;
								return next();
						//	});							
					//	});						
					}
		}  ,	
		
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				userId       : this.userId,
				roomId       : this.roomId,	
				//user         : this.user,
				//room         : this.room,
				date         : this.date
				};
			}
		}
	}
	);
};
