var settings = require('../../config/settings');
var fs = require('fs');
var helpers = require('./_helpers');
var _       = require('lodash');

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
	var params = _.pick(req.body, 'userId');
	fs.readFile(req.files.file.path, function (err, data) {  				
		/*if(!helpers.hasValidExtention(req.files.file.type)){
			error = true;
			result = new Object();
			result.error = error;
			result.errorMessage = "File type is not supported!";
			console.log(result);			
			res.json(result);				
		}*/
		req.models.user.get(params.userId, function(err, user){
			var error = false;
			var errorMessage = "";
			if(err){
				//return next("DB internal error!");
				error = true;
				errorMessage = "DB internal error!";
			}
			if(user == null){
				//return next('User not found!');
				error = true;
				errorMessage = "User not found!";
			}
			else if(!user.vip && req.files.file.size > 2000){
				//return next('non-VIP user uploading large file!');
				error = true;
				errorMessage = "non-VIP user uploading large file!";
			}
			if(error){			
				result = new Object();
				result.error = error;
				result.errorMessage = errorMessage;
				console.log(result);			
				res.json(result);	
				return;
			}
			console.log(req.files.file);
			fileName = new Date().getTime() + req.files.file.name;
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
	});
  }
};
