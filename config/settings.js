var path       = require('path');

var settings = {
  path       : path.normalize(path.join(__dirname, '..')),
  port       : process.env.NODE_PORT || 3000,
  database   : {
    protocol : "mongodb", // or "mysql"
    query    : { pool: true },
    host     : "localhost",
    database : "Berim",
	href     : "mongodb://localhost:27017/Berim"
  }
};

module.exports = settings;
