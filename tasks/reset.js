var models = require('../app/models/');

models(function (err, db) {
  if (err) throw err;

  db.drop(function (err) {
    if (err) throw err;

    db.sync(function (err) {
      if (err) throw err;	 	 	  
	  
	  db.models.user.find().remove(function (err) {
	  if (err) throw err;	
		db.close()
		console.log("Database is Ok!");			
      });	
    });
  });
});
