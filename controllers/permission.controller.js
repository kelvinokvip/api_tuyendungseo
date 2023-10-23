// const { handleSendMessageTelegram } = require("../helpers/telegram");
const Permission = require("../models/permission.model");

const getAllPermission = async (req, res) => {
  try {
    const result = await Permission.find();
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

const getPermissionByRole = async (req, res) => {
  try {
    let role = req.user.role;
    const result = await Permission.find({ role: role }).select("name view edit del add exten");
    let data = result?.filter((item) => item.name !== "permission");
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

module.exports = {
  getPermissionByRole,
  getAllPermission,
};
