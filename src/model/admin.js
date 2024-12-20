const { Schema, default: mongoose } = require("mongoose");

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    info_detail: {
      type: Object,
    },
    role: {
      type: String,
      required: true,
      enum: ["client", "admin", "super-admin"],
      default: "client",
    },
    state: {
      refreshToken: {
        type: String,
        default: "",
      },
      isLoggedIn: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);
