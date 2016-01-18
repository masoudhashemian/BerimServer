var moment = require('moment');

module.exports = function (orm, db) 
{
	var Join = db.define('join', {		
		userId      : { type : 'number', required: true},
		user        : { type : 'object'},
		roomId      : { type : 'number', required: true},
		room        : { type : 'object'},
		date        : { type : 'date', time : true},
		lastMessage : { type : 'object'}
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {							
						obj = this;
						obj.date = Date.now();
						db.models.join.find({roomId : obj.roomId, userId: obj.userId}, function(err, repeatedJoins){							
							if(err){
								console.log('Internal DB error!');
								return next("Internal DB error!");
							}							
							if(repeatedJoins.length > 0 ){
								console.log('Repeated join!');
								return next("Repeated join!");
							}							
							db.models.user.get(obj.userId, function(err, user){
								if(err){
									console.log('DB internal error!');
									return next("DB internal error!");
								}								
								obj.user = user.serialize();
								db.models.room.get(obj.roomId, function(err, room){
									if(err){
										console.log('DB internal error!');
										return next('DB internal error!')
									}									
									obj.room = room.serialize();
									db.models.join.find({roomId : obj.roomId}, function(err ,rooms){
										if(err){
											console.log('Internal DB error!');
											return next("Internal DB error!");
										}										
										if(rooms.length == obj.room.maxUserCount){
											console.log('Room is full!');
											return next("Room is full!");
										}else{											
											return next();
										}
									});								
								});							
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
				roomId       : this.roomId,	
				user         : this.user,
				room         : this.room,
				date         : this.date,
				lastMessage  : this.lastMessage
				};
			}
		}
	}
	);
};
