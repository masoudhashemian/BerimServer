var settings = require('../../config/settings');

module.exports = {
  home:  function (req, res, next) {
	res.sendfile(settings.path + '/public/upload.html');  
  },
  eventTester : function(req, res, next){
	res.sendfile(settings.path + '/public/eventTester.html');
  }
};
