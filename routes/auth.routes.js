const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize.middlewares");
const {
  login,
  register,
  loginWithGoogle,
  loggedUser,
  refreshToken,
  sendCodeEmail
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth");

router.post("/login", login);
router.post("/register", register);
router.post("/loginWithGoogle", loginWithGoogle);
router.post("/logged", verifyToken, loggedUser);
router.post("/user/refresh-token", refreshToken);
router.post("/sendCodeEmail", sendCodeEmail);
module.exports = router;
