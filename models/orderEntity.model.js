const mongoose = require("mongoose");
const OrderEntitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-posts");

module.exports = myDB.model("OrderEntity", OrderEntitySchema);
