
var controllers = require('../app/controllers')

module.exports = function (app) {
  app.get( '/'                           , controllers.home);
  app.post( '/register'                   , controllers.user.register);  
  app.post( '/chat/broadcast_message'                   , controllers.chat.broadcastMessage);  
};
