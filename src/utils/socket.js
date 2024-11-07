// Import Modules
const { Server } = require("socket.io");
const {
  WHITELIST_DOMAINS_DEV,
  WHITELIST_DOMAINS_PRODUCTION,
} = require("./constants");
const env = require("../config/enviroment");
let io;

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: (origin, callback) => {
          const whitelist =
            env.BUILD_MODE === "dev"
              ? WHITELIST_DOMAINS_DEV
              : WHITELIST_DOMAINS_PRODUCTION;

          if (!origin || whitelist.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      },
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("SocketIO is not initialized");
    }
    return io;
  },
};
