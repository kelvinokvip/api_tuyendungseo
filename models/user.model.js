const mongoose = require("mongoose");
const Role = require("./role.model");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0 la chua active, 1 la active
      default: 0,
    },
    email: {
      type: String,
    },
    role: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "Role",
    },
    telegram: {
      type: String,
    },
    socketId: [{ type: String }],
    online: {
      type: Boolean,
      default: false,
    },
    avatar: { type: String },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    token: {
      type: String,
    },
    stk: {
      type: String,
    },
    bankName: {
      type: String,
    },
    accountHolder: {
      type: String,
    },
    note: {
      type: String,
    },
    team: [
      {
        type: String,
      },
    ],
    domain: [
      {
        type: String,
      },
    ],
    level: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
    finishPost: {
      type: Number,
      default: 0,
    },
    average: {
      type: Number,
      default: 5,
      maximum: 5,
      minimum: 1,
    },
    colabDate: {
      type: Date,
      default: Date.now(),
    },
    refundPost: {
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: String,
    },
    promotion: {
      type: String,
    },
    isVerify: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },
    isUser: {
      type: Number,
      default: 0,
      enum: [0, 1],//0 = content, 1 = entity
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.passwordHash;
  },
});

const myDB = mongoose.connection.useDb("micro-user");

module.exports = myDB.model("User", userSchema);
