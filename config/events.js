
var eventHandlers = require('../app/eventHandlers/')

module.exports = function (io, socket, clients) {    
  //eventHandlers.chat(io.of('/chat'), socket);
  eventHandlers.sckt(io, socket, clients);
};
