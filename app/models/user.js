var moment = require('moment');

module.exports = function (orm, db) 
{
	var User = db.define('user', {
		password      : { type: 'text', required: true},
		phoneNumber : { type: 'number', required: true, unique:true}
	},
		
	{   
		 hooks: {
					beforeCreate: function (next) {
						obj=this;
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
			password: [
				orm.enforce.security.password('lun', 'Invalid password,Password must contain number, lower and uppercase letter'),
				orm.enforce.ranges.length(8, undefined, "username must be at least 8 letters long"),
				orm.enforce.ranges.length(undefined, 30, "password cannot be longer than 30 letters")
			],
			phoneNumber:[
				orm.enforce.ranges.length(11, 11, "Must contain 11 characters")
			]
		},
		
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				password     : this.password,
				phoneNumber  : this.phoneNumber				
				};
			},
			getPhoneNumber: function () 
			{
				return this.phoneNumber        
			}					
		}
	}
	);
};
