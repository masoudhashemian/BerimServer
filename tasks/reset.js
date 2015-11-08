var models = require('../app/models/');

models(function (err, db) {
  if (err) throw err;

  db.drop(function (err) {
    if (err) throw err;

    db.sync(function (err) {
      if (err) throw err;

      db.models.user.create({
        userName: "Hello world", password: "123", phoneNumber : "1234567890"
      }, function (err, message) {
        if (err) throw err;

        db.close()
        console.log("Done!");
      });
    });
  });
});
