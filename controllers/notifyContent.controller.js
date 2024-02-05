const NotifyContent = require("../models/notifyContent.model");
const PagedModel = require("../helpers/PagedModel");

const getAll = async (req, res) => {
  try {
    const data = await NotifyContent.find();
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
      searchObject.content = {
        $regex: search,
        $options: "i",
      };
    }
    const data = await NotifyContent.find(searchObject)
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageIndex - 1))
      .limit(pageSize);
    const count = await NotifyContent.countDocuments(searchObject);
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

const getNotifyContentById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await NotifyContent.findOne({ _id: id });
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
    const { type, content } = req.body;

    const checkExists = await NotifyContent.findOne({
      type: type,
    });

    if (checkExists) {
      return res.json({
        success: false,
        message: "Loại thông báo đã tồn tại!",
      });
    }
    const data = new NotifyContent({
      type,
      content,
    });

    await NotifyContent.create(data);

    return res.json({
      success: true,
      message: "Tạo nội dung thông báo thành công!",
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
    const notify = await NotifyContent.findOneAndUpdate({ _id: id }, req.body);
    if (notify) {
      return res.json({ success: true, message: "Sửa thành công!" });
    } else {
      return res.json({
        success: false,
        message: "Nội dung thông báo không tồn tại!",
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
    const data = await NotifyContent.findOneAndDelete({ _id: id });
    if (data) {
      return res.json({ success: true, message: "Xóa thành công!" });
    } else {
      return res.json({ success: false, message: "Không tồn tại nội dung thông báo!" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

module.exports = {
  getAll,
  getNotifyContentById,
  getPaging,
  create,
  update,
  remove,
};
