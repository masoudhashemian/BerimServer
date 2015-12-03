
var controllers = require('../app/controllers')

module.exports = function (app) {
  app.get( '/'                           , controllers.home.home);
  app.post( '/sign_up'                   , controllers.user.register);    
  app.get( '/chat'                        ,controllers.home.chat);
  app.post( '/sign_in'                       ,controllers.user.signIn);  
};
