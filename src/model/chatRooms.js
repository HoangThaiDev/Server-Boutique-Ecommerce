const { Schema, default: mongoose } = require("mongoose");

const chatRoomSchema = new Schema(
  {
    clientID: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(), // tạo ObjectId ngẫu nhiên nếu client chưa login
    },
    adminID: {
      type: String,
      default: null,
    },
    roomStatus: {
      type: String,
      enum: ["open", "full"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chatRoom", chatRoomSchema);
