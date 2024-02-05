const express = require("express");
const router = express.Router();
const {
  create,
  remove,
  getPaging,
  getAll,
  update,
  getNotifyContentById,
} = require("../controllers/notifyContent.controller");
const { verifyToken } = require("../middlewares/auth.js");

router.get(`/notify-content`, verifyToken, getPaging);
router.get(`/notify-content/all`, verifyToken, getAll);
router.get(`/notify-content/:id`, verifyToken, getNotifyContentById);
router.post(`/notify-content`, verifyToken, create);
router.put(`/notify-content/:id`, verifyToken, update);
router.delete(`/notify-content/:id`, verifyToken, remove);

module.exports = router;