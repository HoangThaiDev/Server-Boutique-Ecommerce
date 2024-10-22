// Import Modules
const {
  WHITELIST_DOMAINS_DEV,
  WHITELIST_DOMAINS_PRODUCTION,
} = require("../utils/constants");
const env = require("./enviroment");

exports.corsOptions = {
  origin: function (origin, callback) {
    // Cho phép tất cả trong môi trường dev
    if (env.BUILD_MODE === "dev" && WHITELIST_DOMAINS_DEV.includes(origin)) {
      return callback(null, true);
    }

    // Kiểm tra nếu origin nằm trong WHITELIST_DOMAINS  => Chỉ dùng ở môi trường production
    if (
      env.BUILD_MODE === "production" &&
      WHITELIST_DOMAINS_PRODUCTION.includes(origin)
    ) {
      return callback(null, true);
    }
  },

  optionsSuccessStatus: 200,
  credentials: true,
  exposedHeaders: ["x-access-token"],
};
