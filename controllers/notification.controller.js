const Notification = require("../models/notification.model");
const User = require("../models/user.model");
// Định nghĩa API endpoint để nhận yêu cầu gửi thông báo cho người dùng
const postSendNotificationByUserId = async (req, res) => {
  const { userId } = req.params;
  const { title, message, type } = req.body;

  try {
    // Tạo thông báo mới
    const check = await Notification.findOne({
      title: title,
      message: message,
    });

    if (check) {
      return res.json({ success: false, message: "Thông báo đã tồn tại!" });
    }
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
    let id = userId;
    if (!id) {
      id = req.user.id || req.user._id;
    }
    const notifications = await Notification.find({ userId });

    // Trả về danh sách thông báo
    return res.json(notifications);
  } catch (error) {
    // Trả về phản hồi lỗi nếu có lỗi xảy ra
    return res.status(500).json({
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
    const { pageSize = 10, pageIndex = 1 } = req.query;
    // Lấy danh sách thông báo cho người dùng cụ thể
    const notifications = await Notification.find()
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);
    const totalItem = await Notification.countDocuments();
    const totalPage = Math.ceil(totalItem / pageSize);
    // Trả về danh sách thông báo
    res.json({ data: notifications, totalItem, totalPage });
  } catch (error) {
    // Trả về phản hồi lỗi nếu có lỗi xảy ra
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};

const deleteNotificationById = async (req, res) => {
  // Lấy danh sách thông báo cho người dùng cụ thể
  const notificationId = req.params.id;
  try {
    // Xóa thông báo với notificationId
    await Notification.findByIdAndDelete(notificationId);
    // Trả về phản hồi thành công và thông báo đã tạo
    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    // Trả về phản hồi lỗi nếu có lỗi xảy ra
    res.status(500).json({
      success: false,
      message: "Failed deleted notifications",
      error: error.message,
    });
  }
};

const getNotificationById = async (req, res) => {
  const notificationId = req.params.id;
  try {
    let data;
    // Xóa thông báo với notificationId
    if (notificationId) {
      await Notification.findOne({ _id: notificationId });
    } else {
      data = [];
    }
    // Trả về phản hồi thành công và thông báo đã tạo
    return res.status(200).json({ success: true, data });
  } catch (error) {
    // Trả về phản hồi lỗi nếu có lỗi xảy ra
    res.status(500).json({
      success: false,
      message: "Failed get notification by Id",
      error: error.message,
    });
  }
};

module.exports = {
  postSendNotificationByUserId,
  getSendNotificationByUserId,
  postSendNotificationAll,
  getSendNotificationALl,
  deleteNotificationById,
  getNotificationById,
};
