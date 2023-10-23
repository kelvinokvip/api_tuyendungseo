const unidecode = require("unidecode");
const Category = require("../models/category.model");
// const { createLog } = require("./log.controller");
const PagedModel = require("../helpers/PagedModel");

const getAll = async (req, res) => {
  try {
    const data = await Category.find().select('name');
    //   .select("name price forUser user")
    //   .populate("user", "username")
    //   .populate("forUser", "username");
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
      searchObject.nameNoSign = {
        $regex: unidecode(search).toLocaleLowerCase(),
        $options: "i",
      };
    }
    const data = await Category.find(searchObject)
      .sort({ createdAt: -1 })
      //   .populate("user", "username")
      //   .populate("forUser", "username")
      .skip(pageSize * (pageIndex - 1))
      .limit(pageSize);
    const count = await Category.countDocuments(searchObject);
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
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
const getCateById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Category.findOne({ _id: id });

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
    const name = req.body.name?.trim();
    const { parent, description } = req.body;
    const user = req.user.id;

    if (!name) {
      return res.json({ success: false, message: "Dữ liệu bị thiếu!" });
    }
    const checkExists = await Category.findOne({
      nameNoSign: unidecode(name).toLocaleLowerCase(),
    });
    if (checkExists) {
      return res.json({
        success: false,
        message: "Chuyên mục này đã tồn tại!",
      });
    }

    const newCate = new Category({
      name,
      parent,
      description,
      user,
      nameNoSign: unidecode(name).toLocaleLowerCase(),
    });

    await Category.create(newCate);

    // const messageLog = `${req.user.username} tạo chuyên mục ${name}!`;
    // await createLog(messageLog, "add", req);

    return res.json({
      success: true,
      message: "Tạo chuyên mục thành công!",
      newCate,
    });
  } catch (error) {
    console.log(error);
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

    const cate = await Category.findOneAndUpdate({ _id: id }, req.body);
    if (cate) {
      //   const messageLog = `${req.user.username} sửa chuyên mục ${cate.name}!`;
      //   await createLog(messageLog, "edit", req);

      return res.json({ success: true, message: "Sửa thành công!" });
    } else {
      return res.json({
        success: false,
        message: " Chuyên mục không tồn tại!",
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

    const data = await Category.findOneAndDelete({ _id: id });
    if (data) {
      //   const messageLog = `${req.user.username} xóa chuyên mục ${data.name}!`;
      //   await createLog(messageLog, "del", req);
      return res.json({ success: true, message: "Xóa thành công!" });
    } else {
      return res.json({ success: false, message: "Không tồn tại chuyên mục!" });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

module.exports = { getAll, getCateById, getPaging, create, update, remove };
