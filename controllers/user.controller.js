const User = require("../models/user.model");
const Role = require("../models/role.model");
const Post = require("../models/post.model");
const Category = require("../models/category.model");
const PagedModel = require("../helpers/PagedModel");

const getPagingUser = () => { };
const getAllUSer = () => { };
const createUser = () => { };
const updateUser = () => { };
const updatePasswordUser = () => { };
const updateProfile = () => { };
const removeUser = () => { };

const getPagingCTV = async (req, res) => {
  try {
    const pageSize = req.query.pageSize || 10;
    const pageIndex = req.query.pageIndex || 1;
    const search = req.query.search;
    const isUser = req.query.isUser;
    const isPost = req.query.isPost;

    const role = await Role.find({ name: { $regex: "CTV" } });
    let listRole = role.map(item => { return item._id });
    let searchQuery = {
      role: listRole
      // status: 0,
    };

    if (search) {
      searchQuery = {
        ...searchQuery,
        $or: [
          {
            name: { $regex: search },
          },
          {
            firstname: { $regex: search, $options: "i" },
          },
          {
            lastname: { $regex: search, $options: "i" },
          },
          {
            email: { $regex: search, $options: "i" },
          },
          {
            telegram: { $regex: search, $options: "i" },
          },
          {
            nameNoSign: { $regex: search, $options: "i" },
          },
          {
            username: { $regex: search, $options: "i" },
          },
        ],
      };
    }
    if (isUser) {
      searchQuery.isUser = parseInt(isUser, 10);
    }

    let data = await User.find(searchQuery)
      .select("username firstName lastName status email telegram")
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageIndex - 1))
      .limit(pageSize).lean();
    const dataWithPost = await Promise.all(
      data.map(async (item) => {
        const acceptPost = await Post.find({
          status: 2,
          "receive.user": item._id.toString(),
        });
        const category = await Category.find({ users: item._id })
        return { ...item, acceptPost, category }
      })
    );
    //lấy ra những ctv có bài đã được duyệt
    if (isPost) {
      let data = [];
      dataWithPost.forEach(item => {
        if (item.acceptPost.length > 0) {
          data.push(item);
        }
      })

      const count = await User.countDocuments(searchQuery);
      const totalPage = Math.ceil(count / pageSize);
      const response = new PagedModel(
        pageIndex,
        pageSize,
        totalPage,
        data,
        count
      );
      return res.json(response);
    }
    //
    const count = await User.countDocuments(searchQuery);
    const totalPage = Math.ceil(count / pageSize);

    const response = new PagedModel(
      pageIndex,
      pageSize,
      totalPage,
      dataWithPost,
      count
    );

    return res.json(response);
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
const getAllCTV = async (req, res) => {
  try {
    const role = await Role.find({ name: { $regex: "CTV" } });
    let listRole = role.map(item => { return item._id });
    let searchQuery = {
      role: listRole,
    };

    const data = await User.find(searchQuery).select("username _id");

    return res.json({ data, success: true });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const updateCTV = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, isVerify } = req.body;

    const updateUser = await User.findOneAndUpdate(
      { _id: id },
      { status, isVerify },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Cập nhật user thành công!",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};
module.exports = { getPagingCTV, getAllCTV, updateCTV };
