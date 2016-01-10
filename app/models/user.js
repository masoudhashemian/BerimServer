var moment = require('moment');

module.exports = function (orm, db) 
{
	var User = db.define('user', {
		password      : { type: 'text', required: true},
		phoneNumber : { type: 'number', required: true, unique:true},
		nickName : {type : 'text'},
<<<<<<< HEAD
		room     : {type : 'object'},
		lastSeen : {type : 'date', time : true}
=======
		room     : {type : 'object'}
		//lastSeen :  {type : 'date', time : true}
>>>>>>> d98f77e2d7ab2dfc664258920f22250540498d85
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
<<<<<<< HEAD
					roomId       : this.room._id,
					lastSeen     : this.lastSeen
=======
					roomId       : this.room._id
				//	lastSeen     : this.lastSeen
>>>>>>> d98f77e2d7ab2dfc664258920f22250540498d85
				};
			},
			getRoomId: function(){
				return this.room._id;							
			}
		}
	}
	);	
};
