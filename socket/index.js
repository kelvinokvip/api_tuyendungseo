const socketService = require("./SocketService");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");

const socket = (io) => {
  io.use((socket, next) => {
    const secretKey = authConfig.secret;
    const token = socket.handshake.auth.token;
    jwt.verify(token, secretKey, async (err, authorizedData) => {
      if (err) {
        console.log(err);
        next(new Error("Authentication error"));
      } else {
        if (authorizedData.id) {
          socket.userId = authorizedData.id;
          global._io = io;
          next();
        }
      }
    });
  });
  io.on("connection", socketService);
};

module.exports = socket;
