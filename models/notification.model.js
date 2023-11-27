const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    message: {
      type: String,
      required: true,
    },
    users: [
      {
        id: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        readed: {
          type: Boolean,
          default: false
        }
      }
    ],
    type: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    }
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-user");

module.exports = myDB.model("PostNotification", notificationSchema);
