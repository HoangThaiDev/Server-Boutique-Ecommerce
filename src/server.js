// Import Modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongooseConnect = require("./util/database");
const env = require("./config/enviroment");
const productRouter = require("./router/product");
const userRouter = require("./router/user");

// Create variables
const app = express();
const server = require("http").Server(app);

// Create + use Middleware
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create + use routers
app.use("/shop", productRouter);
app.use("/user", userRouter);

// Create + use server
mongooseConnect(() => {
  server.listen(env.LOCAL_APP_PORT, (err) => {
    if (err) {
      throw new Error("Server starting failled!", err);
    }
    console.log(
      `Hello ${env.AUTHOR}. Server starting with port: ${env.LOCAL_APP_PORT}, host: ${env.LOCAL_APP_HOST}`
    );
  });
});
