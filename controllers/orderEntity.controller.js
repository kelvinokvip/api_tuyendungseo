const OrderEntity = require("../models/orderEntity.model");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const PagedModel = require("../helpers/PagedModel");
const lodash = require("lodash");
const unidecode = require("unidecode");
const moment = require("moment");

const getAll = async (req, res) => {
  try {
    const data = await OrderEntity.find();
    return res.json({ success: true, data: data });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getPaging = async (req, res) => {
  try {
    const search = req.query.search;
    const pageIndex = req.query.pageIndex || 1;
    const pageSize = req.query.pageSize || 10;

    let searchObject = {};
    if (search) {
      searchObject.title = {
        $regex: search,
        $options: "i",
      };
    }
    const data = await OrderEntity.find(searchObject)
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageIndex - 1))
      .limit(pageSize);
    const count = await OrderEntity.countDocuments(searchObject);
    const totalPage = Math.ceil(count / pageSize);

    const response = new PagedModel(
      pageIndex,
      pageSize,
      totalPage,
      data,
      count
    );
    return res.json({ success: true, ...response });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getOrderEntityById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await OrderEntity.findOne({ _id: id });
    return res.json({ success: true, data });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error!",
      error,
    });
  }
};

const create = async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const { content } = req.body;

    const checkExists = await OrderEntity.findOne({
      title: title,
    });

    if (checkExists) {
      return res.json({
        success: false,
        message: "Bài test entity đã tồn tại!",
      });
    }

    const data = new OrderEntity({
      title,
      content,
    });

    await OrderEntity.create(data);

    return res.json({
      success: true,
      message: "Tạo bài test entity thành công!",
      data,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const orderEntity = await OrderEntity.findOneAndUpdate({ _id: id }, req.body);
    if (orderEntity) {
      return res.json({ success: true, message: "Sửa thành công!" });
    } else {
      return res.json({
        success: false,
        message: " bài test entity không tồn tại!",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await OrderEntity.findOneAndDelete({ _id: id });
    if (data) {
      return res.json({ success: true, message: "Xóa thành công!" });
    } else {
      return res.json({ success: false, message: "Không tồn tại bài test entity!" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const receiveRandomEntity = async (req, res) => {
  try {
    const user = req.user.id;
    const checkCurrent = await Post.findOne({
      status: { $in: [0] },
      "receive.user": req.user.id,
    });
    if (checkCurrent) {
      return res.json({ 
       success: false,
       message: "Bạn còn bài entity đang thực hiện hãy hoàn thành nó!",
       data: checkCurrent
      });
    }

    let listOrder = await OrderEntity.find().lean();

    let randomData = lodash.sampleSize(listOrder, 1);
    if (randomData?.length === 0) {
      return res.json({
        success: false,
        message: "Không còn bài viết để nhận!",
      });
    }

    const data = new Post({
      title: randomData[0].title,
      description: randomData[0].content,
      status: 0,
      timer: 2,
      order: randomData[0]?._id,
      isOrder: true,
      receive: {
        user: user,
        receiveTime: moment().toISOString(),
      },
      nameNoSign: unidecode(`${randomData[0].title}`).toLowerCase(),
    });

    await data.save();

    return res.json({
      success: true,
      message: "Nhận bài viết thành công!",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal server error!" });
  }
};

module.exports = {
  getAll,
  getOrderEntityById,
  getPaging,
  create,
  update,
  remove,
  receiveRandomEntity
};
