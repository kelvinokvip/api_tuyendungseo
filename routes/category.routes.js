const express = require("express");
const router = express.Router();
const permissionFieldName = require("../helpers/permissionFieldName.js");
const permissionFunction = require("../helpers/permissionFunction.js");
const {
  create,
  remove,
  getPaging,
  getAll,
  update,
  getCateById,
  addUsers,
  getCateByUser
} = require("../controllers/category.controller");
const { verifyToken } = require("../middlewares/auth.js");

router.get(`/category`, verifyToken, getPaging);
router.get(`/category/all`, verifyToken, getAll);
router.get(`/category/:id`, verifyToken, getCateById);
router.get(`/getCateByUser`, verifyToken, getCateByUser);
router.post(`/category`, verifyToken, create);
router.put(`/category/:id`, verifyToken, update);
router.delete(`/category/:id`, verifyToken, remove);
router.post(`/category/:categoryId/addusers`, verifyToken, addUsers);

module.exports = router;
