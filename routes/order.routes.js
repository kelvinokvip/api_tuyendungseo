const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const {
  createOrderPost,
  getRandomOrderForPostByCate,
  getAllOrderPost,
  deleteOrderPost,
  updateOrderPost,
  sortOrderPost
} = require("../controllers/orderPost.controller");

router.get("/random", verifyToken, getRandomOrderForPostByCate);
router.get("/getOrderPost", verifyToken, getAllOrderPost);
router.post("/create", verifyToken, createOrderPost);
router.post("/update/:id", verifyToken, updateOrderPost);
router.post("/delete/:id", verifyToken, deleteOrderPost);
router.post("/sort", verifyToken, sortOrderPost);

module.exports = router;