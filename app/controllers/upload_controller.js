var settings = require('../../config/settings');

module.exports = {
  sendFile:  function (req, res, next) {
	fileName = req.query.fileName;
	res.sendfile(settings.path + '/uploads/fileSharing/'+fileName);  
  },
  sendAvatar:  function (req, res, next) {
	fileName = req.query.fileName;
	res.sendfile(settings.path + '/uploads/avatars/'+fileName);  
  }  
};
