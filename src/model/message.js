const { Schema, default: mongoose } = require("mongoose");

const messageSchema = new Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatRoom",
      required: true,
    },

    messages: [
      {
        sender: {
          type: String,
          required: true,
          enum: ["client", "admin"],
        },
        content: {
          type: String,
          required: true,
        },
        timeSend: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
