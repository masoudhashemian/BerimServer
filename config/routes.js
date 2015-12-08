
var controllers = require('../app/controllers')

module.exports = function (app) {
  app.get( '/'                           , controllers.home.home);
  app.post( '/user/sign_up'                   , controllers.user.register);    
  app.get( '/chat'                        ,controllers.home.chat);
  app.post( '/user/sign_in'                       ,controllers.user.signIn);  
  app.post('/room/register'                 ,controllers.room.register);
  app.post('/user/get_rooms'                ,controllers.user.getRooms);
  app.get('/eventTester'                    ,controllers.home.eventTester);
  app.post('/chat/add_message'              ,controllers.message.add);
  app.post('/chat/change_message_status'    ,controllers.message.changeStatus);
  app.post('/chat/get_chat_list'    ,controllers.message.getChatList);
  app.post('/place/add_place'       ,controllers.place.register);
};
