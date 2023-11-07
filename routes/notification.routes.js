const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize.middlewares");
const { verifyToken } = require("../middlewares/auth");

const {
  postSendNotificationByUserId,
  getSendNotificationByUserId,
  postSendNotificationAll,
  getSendNotificationALl,
  deleteNotificationById,
  getNotificationById,
} = require("../controllers/notification.controller");

router.post("/notification/:userId", verifyToken, postSendNotificationByUserId);
router.get("/notification/:userId", verifyToken, getSendNotificationByUserId);
router.post("/notification/", verifyToken, postSendNotificationAll);
router.get("/notification/", getSendNotificationALl);
router.delete("/notification/:id", verifyToken, deleteNotificationById);
router.get(`/notificationById/:id`, getNotificationById);
module.exports = router;
