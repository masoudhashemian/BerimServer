var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('../../../../');

module.exports = {
  register: function (req, res, next) {
    var params = _.pick(req.body, 'userName', 'password', 'phoneNumber');
	
    req.models.user.create(params, function (err, user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.send(200, { errors: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }

      return res.send(200, user.serialize());
    });
  }
};
