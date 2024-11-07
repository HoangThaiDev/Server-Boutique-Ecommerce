const { Schema, default: mongoose } = require("mongoose");

const sessionSchema = new Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    participants: {
      clientID: {
        type: String,
        required: true,
      },
      adminID: {
        type: String,
        default: null,
      },
    },
    messages: {
      type: Array,
      required: true,
    },
    endedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("session", sessionSchema);
