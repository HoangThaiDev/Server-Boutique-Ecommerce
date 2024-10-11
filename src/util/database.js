// Import Modules
const mongoose = require("mongoose");
const env = require("../config/enviroment");

const mongooseConnect = async (callback) => {
  try {
    const server = await mongoose.connect(env.URI_MONGODB);
    if (!server) {
      throw new Error("Server Error!");
    }
    console.log(`Connected to server ${env.DATABASE_NAME} successfully`);
    callback();
  } catch (error) {
    console.log("MONGODB: ", error);
  }
};

module.exports = mongooseConnect;
