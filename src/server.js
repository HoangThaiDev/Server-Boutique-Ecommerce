// Import Modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongooseConnect = require("./utils/database");
const env = require("./config/enviroment");
const productRouter = require("./router/product");
const userRouter = require("./router/user");
const cartRouter = require("./router/cart");
const checkoutRouter = require("./router/checkout");
const { corsOptions } = require("./config/cors");

// Create variables
const app = express();
const server = require("http").Server(app);

// Create + use Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

// Create + use routers
app.use("/shop", productRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);

// Create + use server

mongooseConnect(() => {
  if (env.BUILD_MODE === "dev") {
    server.listen(env.LOCAL_APP_PORT, (err) => {
      if (err) {
        throw new Error("Server starting failled!", err);
      }
      console.log(
        `Hello ${env.AUTHOR}. Server starting with port: ${env.LOCAL_APP_PORT}, host: ${env.LOCAL_APP_HOST}`
      );
    });
  }

  if (env.BUILD_MODE === "production") {
    server.listen(process.env.PORT, (err) => {
      if (err) {
        throw new Error("Server starting failled!", err);
      }
      console.log(
        `Hello ${env.AUTHOR}. Server starting with port: ${process.env.PORT}, host: Production`
      );
    });
  }
});
