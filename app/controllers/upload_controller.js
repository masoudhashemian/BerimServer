var settings = require('../../config/settings');
var fs = require('fs');
var helpers = require('./_helpers');

module.exports = {
  sendFile:  function (req, res, next) {
	fileName = req.query.fileName;
	res.sendfile(settings.path + '/uploads/fileSharing/'+fileName);  
  },
  sendAvatar:  function (req, res, next) {
	fileName = req.query.fileName;
	res.sendfile(settings.path + '/uploads/avatars/'+fileName);  
  },
  saveFile: function(req, res, next){	
	fs.readFile(req.files.file.path, function (err, data) {  
		if(!helpers.hasValidExtention(req.files.file.type)){
			error = true;
			result = new Object();
			result.error = error;
			result.errorMessage = "File type is not supported!";
			console.log(result);			
			res.json(result);				
		}
		fileName = new Date().getTime() + '.jpeg';
		newPath = settings.path + '/uploads/fileSharing/'+fileName;
		fileAddress = settings.serverAddress + '/uploads/?fileName='+fileName;
		fs.writeFile(newPath, data, function (err) {
			if(err){
				error = true;
				result = new Object();
				result.error = error;
				result.errorMessage = "An error occurred during saving file!";
				console.log(result);			
				res.json(result);				
			}else{
				error = false;
				result = new Object();
				result.error = error;
				result.data = {fileAddress: fileAddress};
				console.log(result);			
				res.json(result);
			}
		});
	});
  }
};
