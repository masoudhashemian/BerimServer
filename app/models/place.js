var moment = require('moment');

module.exports = function (orm, db) 
{
	var Place = db.define('place', {		
		name      : { type: 'text', required: true},
		voteNumber : { type: 'number', defaultValue: 0}
	},
		
	{   			
		methods: 
		{
			serialize: function () 
			{
				return {
				id           : this._id,
				name     : this.name,
				voteNumber       : this.voteNumber
				};
			}
		}
	}
	);
};
