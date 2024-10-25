require("dotenv").config();

const env = {
  URI_MONGODB: process.env.URI_MONGODB,
  LOCAL_APP_HOST: process.env.LOCAL_APP_HOST,
  LOCAL_APP_PORT: process.env.LOCAL_APP_PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  AUTHOR: process.env.AUTHOR,
  ACCESSTOKEN: process.env.ACCESSTOKEN,
  REFRESHTOKEN: process.env.REFRESHTOKEN,
  BUILD_MODE: process.env.BUILD,
  API_KEY_SENDGRID: process.env.API_KEY_SENDGRID,
};

module.exports = env;
