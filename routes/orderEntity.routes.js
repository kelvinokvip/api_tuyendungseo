const express = require("express");
const router = express.Router();
const {
  create,
  remove,
  getPaging,
  getAll,
  update,
  getOrderEntityById,
  receiveRandomEntity,
} = require("../controllers/orderEntity.controller.js");
const { verifyToken } = require("../middlewares/auth.js");

router.get(`/orderEntity/random`, verifyToken, receiveRandomEntity);
router.get(`/orderEntity`, verifyToken, getPaging);
router.get(`/orderEntity/all`, verifyToken, getAll);
router.get(`/orderEntity/:id`, verifyToken, getOrderEntityById);
router.post(`/orderEntity`, verifyToken, create);
router.put(`/orderEntity/:id`, verifyToken, update);
router.delete(`/orderEntity/:id`, verifyToken, remove);

module.exports = router;