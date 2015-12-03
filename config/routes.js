
var controllers = require('../app/controllers')

module.exports = function (app) {
  app.get( '/'                           , controllers.home.home);
  app.post( '/user/sign_up'                   , controllers.user.register);    
  app.get( '/chat'                        ,controllers.home.chat);
  app.post( '/user/sign_in'                       ,controllers.user.signIn);  
  app.post('/room/register'                 ,controllers.room.register);
};
