
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
  }
};
