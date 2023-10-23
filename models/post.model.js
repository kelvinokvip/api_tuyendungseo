const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    keywords: [
      {
        type: String,
      },
    ],
    status: {
      type: Number, // 0: đang viết, 1 là hoàn thành , 2 là duyệt, -1 là hết hạn, -2 là không duyệt
      default: 0,
    },
    word: {
      type: Number,
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
      title: {
        type: String,
      },
      deadline: {
        type: Date,
      },
      word: {
        type: String,
      },
    },
    censor: {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      date: {
        type: Date,
        default: new Date(),
      },
      note: {
        type: String,
      },
    },
    timer: {
      //thời gian làm bài (tính theo giờ)
      type: Number,
      min: 1,
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: "OrderPost",
    },
    nameNoSign: {
      type: String,
    },
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-posts");

module.exports = myDB.model("Post", postSchema);
