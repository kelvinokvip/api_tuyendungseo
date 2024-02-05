const mongoose = require("mongoose");
const NotifiContentSchema = new mongoose.Schema(
  {
    type: {
      type: Number,
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

const myDB = mongoose.connection.useDb("micro-user");

module.exports = myDB.model("NotifyContent", NotifiContentSchema);