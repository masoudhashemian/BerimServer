
var settings = require('../../config/settings');
var fs = require('fs');

module.exports = {
  checkLogin: function(socket,responseEvent) {
	console.log(socket.userId);
    if(socket.userId == null){
		error = true;
		res = new Object();
		res.error = error;
		res.errorMessage = "Access is denied! You must log in.";		
		socket.emit(responseEvent, res);		
		return false;
	}
	return true;
  },
  saveAttachment: function(data, userId){
	file = data.file;
	if(file != null){
		ext = data.fileExt;				
		file = new Uint8Array(file);
		fileName = new Date().getTime() + '-' +  userId + '.'+ext;						
		fs.appendFileSync(settings.path+'/uploads/'+fileName, new Buffer(file));						
		return fileName;		
	}
  },
  loadAttachment: function(data){
	fileName = data.fileName;
	if(fileName != null){
		return fs.readFileSync(settings.path+'/uploads/'+fileName);
	}
  }
};
