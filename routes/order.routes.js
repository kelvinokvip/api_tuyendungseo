const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const {
  createOrderPost,
  getRandomOrderForPostByCate,
  getPagingOrderPost
} = require("../controllers/orderPost.controller");



router.get("/random", verifyToken, getRandomOrderForPostByCate);
router.get("/getOrderPost", verifyToken, getPagingOrderPost);
router.post("/create", verifyToken, createOrderPost);

module.exports = router;