const mongoose = require("mongoose");

const confirmCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    code: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      default: false // true: đã xác thực
    }
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-user");

module.exports = myDB.model("confirmCode", confirmCodeSchema)
