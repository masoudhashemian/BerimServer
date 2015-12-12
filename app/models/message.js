var moment = require('moment');

module.exports = function (orm, db) 
{
	var Message = db.define('message', {		
		senderId      : { type: 'number', required: true},
		sender      : { type: 'number'},
		roomId : { type: 'number', required: true},
		text : {type: 'text', required: true},
		status : {type: 'text', defaultValue: 'deliverAtServer'},				
		date : {type : 'date', time : true}		
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {						
						obj = this;
						this.date = Date.now();
						db.models.user.get(this.senderId, function(err, user){
							obj.sender = user;	
							console.log('vvv');
							return next();							
						});						
						console.log('ddd');
					}
		}  ,	
		
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				sender       : this.sender,	
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
