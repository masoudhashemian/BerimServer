var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm'); 
var settings = require('../../config/settings');

module.exports = {
  tribune: function(req, res, next){
	res.sendfile(settings.path + '/public/tribune.html');
  }
};
