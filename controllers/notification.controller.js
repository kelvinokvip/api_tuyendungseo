const Notification = require("../models/notification.model");
const User = require("../models/user.model");
// Định nghĩa API endpoint để nhận yêu cầu gửi thông báo cho người dùng
const postSendNotificationByUserId = async (req, res) => {
  const { userId } = req.params;
  const { title, message, type } = req.body;

  try {
    // Tạo thông báo mới
    const newNotification = await Notification.create({
      userId,
      title,
      message,
      type,
    });

    // Trả về phản hồi thành công và thông báo đã tạo
    res.json({
      success: true,
      message: "Notification sent successfully",
      notification: newNotification,
    });
  } catch (error) {
    // Trả về phản hồi lỗi nếu có lỗi xảy ra
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
};

const getSendNotificationByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Lấy danh sách thông báo cho người dùng cụ thể
    const notifications = await Notification.find({ userId });

    // Trả về danh sách thông báo
    res.json(notifications);
  } catch (error) {
    // Trả về phản hồi lỗi nếu có lỗi xảy ra
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};

const postSendNotificationAll = async (req, res) => {
  const { title, message, type } = req.body;

  try {
    // Lấy danh sách tất cả người dùng
    const allUsers = await User.find();
    allUsers.map((user) =>
      Notification.create({
        userId: user._id,
        title,
        message,
        type,
      })
    );

    // Trả về phản hồi thành công
    res.json({ success: true, message: "Notification sent to all users" });
  } catch (error) {
    // Trả về phản hồi lỗi nếu có lỗi xảy ra
    res.status(500).json({
      success: false,
      message: "Failed to send notification all users",
      error: error.message,
    });
  }
};

const getSendNotificationALl = async (req, res) => {
  try {
    // Lấy danh sách thông báo cho người dùng cụ thể
    const notifications = await Notification.find();

    // Trả về danh sách thông báo
    res.json(notifications);
  } catch (error) {
    // Trả về phản hồi lỗi nếu có lỗi xảy ra
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};
module.exports = {
  postSendNotificationByUserId,
  getSendNotificationByUserId,
  postSendNotificationAll,
  getSendNotificationALl,
};
