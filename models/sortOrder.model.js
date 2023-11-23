const mongoose = require("mongoose");
const OrderPostSchema = new mongoose.Schema(
  {
   name: {
    type: String,
    require: true,
    unique: true,
   },
   sort: [{ 
      type: mongoose.Types.ObjectId
    }]
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("micro-posts");

module.exports = myDB.model("sortOrder", OrderPostSchema);
