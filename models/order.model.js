const mongoose = require("mongoose");
const OrderPostSchema = new mongoose.Schema(
  {
    require: {
      title: String,
      description: String,
      category: String,
      keywords: [String],
      words: Number,
      expiresDate: Date,
      status: { type: Number, default: 1 }, // 0 là hết hạn, 1 là còn hạn
    },
    bank: {
      stk: String,
      bank_name: String,
      accountHolder: String,
      note: String,
      total: Number,
      status: { type: Number, default: 0 }, // 0 là chưa bank, 1 là đã bank
    },
    feedback: {
      star: Number,
      note: String,
    },
    status: { type: Number, default: -1 }, // -5 đã tạo link, -4 đã thanh toán,-3 post lại,-2 là refund, -1 là chưa nhận, 0 là đã nhận, 1 là đã hoàn thành, 2 là cần sửa
    receive: {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      date: {
        type: Date,
      },
      content: String,
      description: String,
      title: String,
      category: String,
      words: Number,
      finishDate: {
        type: Date,
      },
    },
    fixes: {
      note: String,
    },
    team: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-orders");

module.exports = myDB.model("OrderPost", OrderPostSchema);
