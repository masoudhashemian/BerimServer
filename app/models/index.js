var orm      = require('orm');
var settings = require('../../config/settings');

var connection = null;

function setup(db, cb) {
  require('./user')(orm, db);  
  require('./room')(orm, db);  
  require('./join')(orm, db);  
  require('./message')(orm, db);  
  require('./place')(orm, db);
  require('./userLogIn')(orm, db);
  require('./review')(orm, db);
  
  return cb(null, db);
}

module.exports = function (cb) {
  if (connection) return cb(null, connection);

  orm.connect(settings.database, function (err, db) {
    if (err) return cb(err);

	 db.settings.set('instance.cache', false);
	
    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};
