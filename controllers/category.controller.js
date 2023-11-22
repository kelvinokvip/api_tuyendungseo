const unidecode = require("unidecode");
const Category = require("../models/category.model");
// const { createLog } = require("./log.controller");
const PagedModel = require("../helpers/PagedModel");
const userModel = require("../models/user.model");
const { isValidObjectId } = require("mongoose");

const getAll = async (req, res) => {
  try {
    const data = await Category.find().select("name");
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
    const { parent, description, users } = req.body;

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
      users,
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

const addUsers = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { username } = req.body;
    // Kiểm tra xem user có tồn tại hay không
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra xem danh mục có tồn tại hay không
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // Kiểm tra xem ctv đã được thêm hay chưa
    const checkUser = await Category.findOne({
      users: user.username,
    });
    if (checkUser) {
      return res.status(404).json({ message: "CTV đã tồn tại" });
    }
    // Thêm người dùng vào danh mục
    category.users.push(user.username);
    await category.save();

    res.status(201).json({ message: "Đã thêm người dùng vào danh mục" });
  } catch (error) {
    console.error("Lỗi khi thêm người dùng vào danh mục:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};

module.exports = {
  getAll,
  getCateById,
  getPaging,
  create,
  update,
  remove,
  addUsers,
};
