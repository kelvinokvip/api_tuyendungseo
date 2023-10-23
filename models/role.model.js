const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    level: {
      type: Number,
    },
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-user");

module.exports = myDB.model("Role", roleSchema)
