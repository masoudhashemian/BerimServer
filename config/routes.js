
var controllers = require('../app/controllers')

module.exports = function (app) {
  app.get( '/'                           , controllers.home);
  app.post( '/register'                   , controllers.user.register);  
  app.get( '/chat/tribune'                   , controllers.chat.tribune);  
  app.post( '/signin'                   , controllers.user.signIn);
};
