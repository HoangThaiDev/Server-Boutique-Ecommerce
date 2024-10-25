const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    state: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
