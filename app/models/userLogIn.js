var moment = require('moment');

module.exports = function (orm, db) 
{
	var userLogIn = db.define('userLogIn', {		
		phoneNumber : { type : 'number', required: true},
		deviceId    : { type : 'number', required: true},
		active      : { type : 'boolean'},
		activationCode : {type : 'number'}
	},
		
	{   		 		
		 hooks: {
					beforeCreate: function (next) {
						obj=this;						
						obj.activationCode = Math.round(Math.random()*10000);
						obj.active = false;
						return next();
					}
		}  ,
		
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				phoneNumber  : this.phoneNumber,
				deviceId     : this.deviceId,	
				active       : this.active,
				activationCode : this.activationCode
				};
			}
		}
	}
	);
};
