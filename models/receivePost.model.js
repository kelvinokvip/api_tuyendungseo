const mongoose = require("mongoose");
const receivePostSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    status: {
      type: Number,
      enum: [-1, 0, 1], // -1 là vừa nhận, 0 là đang viết, 1 là hoàn thành
      default: 0,
    },
    deadline: {
      type: Date,
    },
    receive: {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      receiveTime: {
        type: Date,
      },
      finishTime: {
        type: Date,
      },
      content: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-posts");

module.exports = myDB.model("ReceivePost", receivePostSchema);
