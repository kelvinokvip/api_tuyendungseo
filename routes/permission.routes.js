const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize.middlewares");
const { verifyToken } = require("../middlewares/auth");
const { getPermissionByRole } = require("../controllers/permission.controller");


router.get("/getByRole", verifyToken , getPermissionByRole);
module.exports = router;
