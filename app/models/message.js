var moment = require('moment');

module.exports = function (orm, db) 
{
	var Message = db.define('message', {		
		senderId      : { type: 'number', required: true},
		sender      : { type: 'number'},
		roomId : { type: 'number', required: true},
		text : {type: 'text', required: true},
		status : {type: 'text', defaultValue: 'deliverAtServer'},				
		date : {type : 'date', time : true},
		updateStatus : {type : 'boolean'},
		fileAddress     : {type : 'text'}
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {						
						obj = this;
						this.date = Date.now();
						this.updateStatus = false;
						db.models.user.get(this.senderId, function(err, user){
							obj.sender = user.serialize();								
							return next();							
						});												
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
				date         : this.date,
				updateStatus : this.updateStatus,
				fileAddress     : this.fileAddress
				};
			}
		}
	}
	);
};
