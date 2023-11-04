const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize.middlewares");
const { verifyToken } = require("../middlewares/auth");

const {
  postSendNotificationByUserId,
  getSendNotificationByUserId,
  postSendNotificationAll,
  getSendNotificationALl,
} = require("../controllers/notification.controller");

router.post("/notification/:userId", verifyToken, postSendNotificationByUserId);
router.get("/notification/:userId", verifyToken, getSendNotificationByUserId);
router.post("/notification/", verifyToken, postSendNotificationAll);
router.get("/notification/", getSendNotificationALl);
module.exports = router;
