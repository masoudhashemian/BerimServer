
var eventHandlers = require('../app/eventHandlers')

module.exports = function (io, socket) {    
  //eventHandlers.chat(io.of('/chat'), socket); ??????????  
  eventHandlers.chat(io, socket);
};
