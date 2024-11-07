// Import modules
const io = require("../utils/socket");

// Import Models
const Message = require("../model/message");
const ChatRoom = require("../model/chatRooms");
const Session = require("../model/session");

exports.getMessageByRoomId = async (req, res) => {
  const { roomId } = req.params;

  try {
    const findMessage = await Message.findOne({ chatRoomId: roomId });

    if (!findMessage) {
      return res.status(404).json({ message: "No found messages !" });
    }

    res.status(200).json(findMessage);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postSendMessageByRoomId = async (req, res) => {
  const { sender, valueMessage } = req.body;
  const { roomId } = req.params;

  try {
    const findMessage = await Message.findOne({ chatRoomId: roomId }).populate(
      "chatRoomId"
    );

    // If client or admin chat /end => End liveChat + delete roomID + messageID
    if (valueMessage === "/end") {
      const newSession = await new Session({
        roomId: roomId,
        participants: {
          adminID: findMessage.chatRoomId.adminID,
          clientID: findMessage.chatRoomId.clientID,
        },
        messages: findMessage.messages,
      });
      const result = await newSession.save();

      if (!result) {
        return res.status(400).json({ message: "Error with /end chat !" });
      }

      // Remove room was end chat from modal ChatRoom
      const rooms = await ChatRoom.find();
      const filterRooms = rooms.filter(
        (room) => room._id.toString() !== roomId
      );

      // Use Socket
      if (sender === "client") {
        io.getIO().emit("Server:clientEndChat", {
          rooms: filterRooms,
        });
      } else {
        io.getIO().emit("Server:adminEndChat", "Admin end chat!");
      }
      res.status(200).json({
        message: "Leave room success!",
        messages: [],
        rooms: filterRooms,
      });

      // Delete roomID + messageID
      const isDeleteChatRoomSuccess = await ChatRoom.findByIdAndDelete(roomId);
      const isDeleteMessagesSuccess = await Message.findOneAndDelete({
        chatRoomId: roomId,
      });

      if (!isDeleteChatRoomSuccess || !isDeleteMessagesSuccess)
        return res.status(400).json({ message: "Server Error!" });
    } else {
      if (!findMessage) {
        return res.status(404).json({ message: "No found messages !" });
      }

      // // Add message in collection
      findMessage.messages.push({ sender: sender, content: valueMessage });

      const result = await findMessage.save();

      if (!result) {
        return res.status(404).json({ message: "Send message failled !" });
      }
      console.log(result);

      // Use Socket
      if (sender === "client") {
        io.getIO().emit("Server:clientSendMessage", result.messages);
      } else {
        io.getIO().emit("Server:adminSendMessage", result.messages);
      }
      res
        .status(200)
        .json({ message: "Send message success", messages: result.messages });
    }
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};
