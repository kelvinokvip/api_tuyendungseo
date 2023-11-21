const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize.middlewares");
const { verifyToken } = require("../middlewares/auth");

const {
  postSendNotification,
  getSendNotificationByUserId,
  postSendNotificationAll,
  getSendNotificationALl,
  deleteNotificationById,
  getNotificationById,
} = require("../controllers/notification.controller");

router.post("/notification", postSendNotification);
router.get("/notification/:userId", verifyToken, getSendNotificationByUserId);
router.get("/notification/", verifyToken, getSendNotificationALl);
router.delete("/notification/:id", verifyToken, deleteNotificationById);
router.get(`/notificationById/:id`, verifyToken, getNotificationById);
module.exports = router;
