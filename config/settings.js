var path       = require('path');

var settings = {
  path       : path.normalize(path.join(__dirname, '..')),
  port       : process.env.NODE_PORT || 3000,
  serverAddress : "http://localhost:3000",
  database   : {
    protocol : "mongodb", // or "mysql"
    query    : { pool: true },
    host     : "127.0.0.1",
    database : "Berim",
	href     : "mongodb://127.0.0.1:27017/Berim"
  }
};

module.exports = settings;
