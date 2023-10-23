const ReceivePost = require("../models/receivePost.model");

const receivePost = async (req, res) => {
  try {
    
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
const undoReceivePost = () => {};
const softDelete = () => {};
const remove = () => {};
