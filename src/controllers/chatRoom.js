// Import Modules
const io = require("../utils/socket");

// Import Models
const ChatRoom = require("../model/chatRooms");
const Message = require("../model/message");

// Import Helper
const jwt = require("../helper/jwt");
const env = require("../config/enviroment");

exports.postCreateChatRoom = async (req, res) => {
  const { accessToken } = req.body;
  let newChatRoom;

  try {
    // Check user was logged in or not
    if (accessToken === "") {
      newChatRoom = await new ChatRoom();
    }

    if (accessToken !== "") {
      const { userId } = await jwt.verifyAccessToken(
        accessToken,
        env.ACCESSTOKEN
      );
      newChatRoom = await new ChatRoom({ clientID: userId });
    }

    const result = await newChatRoom.save();

    if (!result) {
      return res.status(400).json({ message: "Can't connection with admin!" });
    }

    // Create session box chat
    const introduceMessage = {
      sender: "admin",
      content: "Xin chào bạn, vui lòng đợi một chút sẽ có admin hỗ trợ bạn.",
    };

    const message = await new Message({
      chatRoomId: newChatRoom._id,
      messages: [introduceMessage],
    });

    await message.save();

    // Get rooms from model ChatRoom
    const rooms = await ChatRoom.find();
    io.getIO().emit("Server:createNewRoom", rooms);

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find().select({ adminID: 0 });

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getJoinRoom = async (req, res) => {
  const { roomID } = req.params;
  const { accessToken } = req.body;

  try {
    const accessTokenDecode = await jwt.verifyAccessToken(
      accessToken,
      env.ACCESSTOKEN
    );

    // Add AdminID join roomID of clientID
    const findRoomById = await ChatRoom.findById(roomID);

    // Check roomID status is full or open
    if (findRoomById.roomStatus === "full") {
      const isAdminValid =
        findRoomById.adminID === accessTokenDecode.userId ? true : false;

      if (!isAdminValid) {
        return res
          .status(400)
          .json({ message: "This room has admin was joined!" });
      }
    } else {
      findRoomById.adminID = accessTokenDecode.userId;
      findRoomById.roomStatus = "full";

      const isRoomStatusValid = await findRoomById.save();

      if (!isRoomStatusValid) {
        return res.status(400).json({ message: "Join room failled!" });
      }
    }

    // Get messages of roomID
    const messages = await Message.findOne({ chatRoomId: roomID });

    if (!messages) {
      return res.status(404).json({ message: "Not found room by id!" });
    }

    // Work with socketIO
    const rooms = await ChatRoom.find();

    io.getIO().emit("Server:adminJoinRoom", {
      messages,
      rooms,
      adminID: accessToken,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};
