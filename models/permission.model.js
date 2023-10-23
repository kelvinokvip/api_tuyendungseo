const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: ObjectId,
      ref: "Role",
      required: true,
    },
    name: {
      type: String,
      require: true,
    },
    add: {
      type: Boolean,
      default: false,
    },
    view: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    del: {
      type: Boolean,
      default: false,
    },
    exten: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-user");

module.exports = myDB.model("Permission", permissionSchema);
