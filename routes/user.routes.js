const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize.middlewares");
const { verifyToken } = require("../middlewares/auth");

const {
  getRandomOrderForPostByCate,
} = require("../controllers/orderPost.controller");
const {
  getPagingCTV,
  getAllCTV,
  updateCTV,
} = require("../controllers/user.controller");

router.get("/ctv", verifyToken, getPagingCTV);
router.get("/ctv/all", verifyToken, getAllCTV);
router.put("/ctv/:id", verifyToken, updateCTV);
module.exports = router;
