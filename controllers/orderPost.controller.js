const { convertToAccentedStringVietnamese } = require("../helpers/regexMaker");
const OrderPost = require("../models/order.model");
const sortOrder = require("../models/sortOrder.model");
const Category = require("../models/category.model");
const Post = require("../models/post.model");
const moment = require("moment");
const lodash = require("lodash");
const { checkExpiresPost } = require("./post.controller");
const getRandomOrderForPostByCate = async (req, res) => {
  try {
    await checkExpiresPost();
    const count = req.query.count || 5;
    const category = req.query.category;

    const allCate = await Category.find({}).select("name");
    const allPost = await Post.find().select("order");
    let initQuery = {
      createdAt: {
        $gte: moment().subtract(30, "day").startOf("day").toISOString(),
      },
      // category:{$not:{$in:["Guestpost","GP","guestpost"]}},
      // status:{$in: [-5,-4]},
      // _id:{$not: {$in: allPost?.map(item => item.order)}}
    };

    if (allCate.find((item) => item.name === category)) {
      initQuery["require.category"] = { $regex: category, $options: "i" };
    } else {
      // initQuery["require.category"] = {
      //   $not: { $in: allCate.map((item) => item.name) },
      // };
    }

    let data = await OrderPost.find(initQuery).select("require user");
    let randomData = lodash.sampleSize(data, count);

    return res.json(randomData);
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const randomSkip = (count, pageSize) => {
  const numberSkip = Math.floor(Math.random(1) * count);
  if (numberSkip - pageSize < pageSize || numberSkip < pageSize) {
    return randomSkip(count, pageSize);
  } else {
    return numberSkip;
  }
};

const createOrderPost =  async (req, res) => {
  const {title, description, category, keywords, words} = req.body;
  try {
   const data =  await OrderPost.create({
      require: {
        title,
        description,
        category,
        keywords: keywords.toString().split(","),
        words
      },
      user: req.user._id
    })
    let dataSort = await sortOrder.findOne({name: "sort-order"});
    if(!dataSort){
      dataSort = await sortOrder.create({name: "sort-order"})
    }
    dataSort.sort.unshift(data._id);
    await dataSort.save();
    return res.json({ success: true, message: "Tạo order post success", data });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      error,
    });
  }
}


const getAllOrderPost =  async (req, res) => {
  try {
   const data =  await OrderPost.find({}).lean();
   const sort =  await sortOrder.findOne({name: "sort-order"}).lean();
    return res.json({data,  sort: sort || {}});
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      error,
    });
  }
}

const updateOrderPost =  async (req, res) => {
  const {title, description, category, keywords, words} = req.body;
  try {
    const post = await OrderPost.findById(req.params.id)
    if(!post){
      return res.json({ success: false, message: "post không tìm thấy" });
    }
    post.require = {
      title,
      description,
      category,
      keywords: keywords.toString().split(","),
      words
    };
    await post.save();
    return res.json({ success: true, message: "Update order post success" });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      error,
    });
  }
}

const deleteOrderPost =  async (req, res) => {
  try {
    const id = req.params.id;

    const result = await OrderPost.findOneAndDelete({ _id: id });
    let dataSort = await sortOrder.findOne({name: "sort-order"});
    if(dataSort){
      dataSort.sort = dataSort.sort.filter(i => i.toString() !== id)
      dataSort.save()
    }
    if (!result) {
      return res.json({ success: false, message: "Bài viết không tồn tại!" });
    } else {
      return res.json({ success: true, message: "Xóa thành công!" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      error,
    });
  }
}
const sortOrderPost =  async (req, res) => {
  try {
      let dataSort = await sortOrder.findOne({name: "sort-order"});
      if(!dataSort){
        dataSort = await sortOrder.create({name: "sort-order"})
      }
      if(!req.body.sort){
        return res.json({ success: false, message: "data sort bị thiếu"});
      }
      dataSort.sort = req.body.sort
      await dataSort.save()
      res.json({ success: true, message: "sort order success" });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      error,
    });
  }
}

module.exports = {
  getRandomOrderForPostByCate,
  createOrderPost,
  getAllOrderPost,
  deleteOrderPost,
  updateOrderPost,
  sortOrderPost
};
