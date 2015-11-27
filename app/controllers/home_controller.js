var settings = require('../../config/settings');

module.exports = {
  home:  function (req, res, next) {
	res.sendfile(settings.path + '/public/index.html');  
  },
  chat : function(req, res, next){
	res.sendfile(settings.path + '/public/chat.html');
  }
};
