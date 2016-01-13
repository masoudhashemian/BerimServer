
var controllers = require('../app/controllers')

module.exports = function (app) {
  app.get( '/'                           , controllers.home.home);
  app.post( '/user/sign_up'                   , controllers.user.register);
  app.post( '/user/sign_in'                       ,controllers.user.signIn);  
  app.post('/room/add_room'                 ,controllers.room.register);
  app.post('/user/get_rooms'                ,controllers.user.getRooms);
  app.get('/eventTester'                    ,controllers.home.eventTester);
  app.post('/chat/add_message'              ,controllers.message.add);
  app.post('/chat/change_message_status'    ,controllers.message.changeStatus);
  app.post('/chat/bulk_change_message_status'    ,controllers.message.bulkChangeStatus);
  app.post('/chat/change_message_status_got',controllers.message.changeStatusGot);
  app.post('/chat/bulk_change_message_status_got',controllers.message.bulkChangeStatusGot);
  app.post('/chat/get_updated_status_chat_list',controllers.message.getUpdatedStatusChatList);
  app.post('/chat/get_chat_list'    ,controllers.message.getChatList);
  app.post('/place/add_place'       ,controllers.place.register);
  app.get('/place/get_places'       ,controllers.place.getList);
  app.post('/room/add_user_to_room' ,controllers.room.addUser);
  app.post('/user/get_user_info'    ,controllers.user.getUserInfo);
  app.post('/user/search_user'      ,controllers.user.searchUser);
  app.get('/uploads'                ,controllers.upload.sendFile);
  app.get('/avatars'                ,controllers.upload.sendAvatar);
  app.post('/user/update_last_seen' ,controllers.user.updateLastSeen);  
  app.post('/user/set_avatar'       ,controllers.user.setAvatar);  
  app.post('/user/active'           ,controllers.user.active);      
  app.post('/uploads'               ,controllers.upload.saveFile);
};
