var moment = require('moment');

module.exports = function (orm, db) {
  var Message = db.define('user', {
    userName     : { type: 'text', required: true },
    password      : { type: 'text', required: true},
    phoneNumber : { type: 'number', required: true}
  },
  {
    validations: {
      userName: [
        orm.enforce.ranges.length(1, undefined, "must be atleast 1 letter long"),
        orm.enforce.ranges.length(undefined, 96, "cannot be longer than 96 letters")
      ],
      password: [
        orm.enforce.ranges.length(1, undefined, "must be atleast 1 letter long"),
        orm.enforce.ranges.length(undefined, 96, "cannot be longer than 96 letters")
      ]
    },
    methods: {
      serialize: function () {

        return {
          id        : this._id,
          userName     : this.userName,
          password      : this.password,
		  phoneNumber    : this.phoneNumber
        };
      }
    }
  });
};
