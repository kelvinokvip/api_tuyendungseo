const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
    },
    parent: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    nameNoSign: {
      type: String,
    },
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-posts");

module.exports = myDB.model("Category", categorySchema);
