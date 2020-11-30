const socketIO = require('socket.io');

let IO;

module.exports = {
  init: (httpServer) => {
    IO = socketIO(httpServer, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return IO;
  },
  getIO: () => {
    if (!IO) {
      throw new Error('Socket.io not initialized!');
    }
    return IO;
  },
};
