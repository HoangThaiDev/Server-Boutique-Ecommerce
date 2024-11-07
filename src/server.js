// Import Modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongooseConnect = require("./utils/database");
const env = require("./config/enviroment");
const { corsOptions } = require("./config/cors");
const path = require("path");
const multer = require("multer");
const socket = require("./utils/socket");

// Import Routers
const productRouter = require("./router/product");
const userRouter = require("./router/user");
const cartRouter = require("./router/cart");
const checkoutRouter = require("./router/checkout");
const adminRouter = require("./router/admin");
const chatRoomRouter = require("./router/chatRoom");
const sessionRouter = require("./router/session");
const messageRouter = require("./router/message");

// Create variables
const app = express();
const server = require("http").Server(app);
const storageMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./src/images");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    return cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Create + use Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "images")));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  multer({ storage: storageMulter, fileFilter: fileFilter }).array("images")
);

// Create + use Template: EJS
app.set("view engine", "ejs");
app.set("views", "src/views");

// Create + use server
const connectServerWithDbs = () => {
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
};

mongooseConnect(connectServerWithDbs);

// Create + connect SocketIO --- Client - Admin side
const io = socket.init(server);

io.on("connection", (socket) => {
  console.log("socket connection", socket.id);

  socket.on("disconnect", (err) => {
    console.log("disconnection", socket.id);
  });
});

// Create + use routers
app.use("/shop", productRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/admin", adminRouter);
app.use("/admin", adminRouter);
app.use("/chatRoom", chatRoomRouter);
app.use("/message", messageRouter);
app.use("/session", sessionRouter);
