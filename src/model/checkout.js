// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const checkoutSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    info_client: {
      type: Object,
      required: true,
    },
    cart: {
      type: Object,
      required: true,
    },
    state: {
      status: {
        type: String,
        required: true,
        enum: ["Waiting for pay", "Paid"],
        default: "Waiting for pay",
      },
      delivery: {
        type: String,
        required: true,
        enum: ["Waiting for progressing", "In progress", "Delivered"],
        default: "Waiting for progressing",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("checkout", checkoutSchema);
