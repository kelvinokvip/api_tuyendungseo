const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize.middlewares");
const { verifyToken } = require("../middlewares/auth");
const { getPermissionByRole } = require("../controllers/permission.controller");
const {
  getPagingPost,
  getById,
  update,
  remove,
  create,
  receivePost,
  finishPost,
  getMyPost,
  startPost,
  updateStatusPost,
  receiveRandomPost,
  updateDeadlinePost
} = require("../controllers/post.controller");


router.get("/", verifyToken, getPagingPost);

router.get("/my-post", verifyToken, getMyPost);
router.get("/:id", verifyToken, getById);
router.post("/", verifyToken, create);
router.post("/receive/random", verifyToken, receiveRandomPost);
router.post("/receive/:id", verifyToken, receivePost);
router.put("/update-deadline/:id", verifyToken, updateDeadlinePost);
router.put("/finish/:id", verifyToken, finishPost);
router.put("/start/:id", verifyToken, startPost);
router.put("/:id", verifyToken, updateStatusPost);
router.delete("/:id", verifyToken, remove);
module.exports = router;
