var moment = require('moment');
var settings = require('../../config/settings');

module.exports = function (orm, db) 
{
	var User = db.define('user', {
		password      : { type: 'text', required: true},
		phoneNumber : { type: 'number', required: true, unique:true},
		nickName : {type : 'text'},
		room     : {type : 'object'},
		lastSeen : {type : 'date', time : true},
		avatarAddress : {type : 'text'},
		active : {type : 'boolean'},
		activationCode : {type : 'number'}
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {
						obj=this;
						obj.avatarAddress = settings.serverAddress+'/avatars/?fileName=default-avatar.png';
						obj.activationCode = Math.round(Math.random()*10000);
						obj.active = false;
						User.exists({phoneNumber: this.phoneNumber}, function (err, exists) 
						{
							if (exists)
							{
								return next(new Error("phoneNumber already exists"));
							}
							
							return next();
							
						});
					}
		}  ,
	
	
		validations: 
		{
			/*password: [
				orm.enforce.security.password('lun', 'Invalid password,Password must contain number, lower and uppercase letter'),
				orm.enforce.ranges.length(8, undefined, "Password must be at least 8 letters long"),
				orm.enforce.ranges.length(undefined, 30, "Password cannot be longer than 30 letters")
			],
			phoneNumber:[
				orm.enforce.ranges.length(11, 11, "Phone number must contain 11 characters")
			] */
		},
		
		methods: 
		{
			serialize: function () 
			{
				return {
					id           : this._id,
					password     : this.password,
					phoneNumber  : this.phoneNumber,
					nickName     : this.nickName,					
					roomId       : this.room._id,
					lastSeen     : this.lastSeen,
					avatarAddress : this.avatarAddress,
					active    : this.active,
					activationCode : this.activationCode
				};
			},
			getRoomId: function(){
				return this.room._id;							
			}
		}
	}
	);	
};
