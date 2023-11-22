const { convertToAccentedStringVietnamese } = require("../helpers/regexMaker");
const OrderPost = require("../models/order.model");
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
      category:{$not:{$in:["Guestpost","GP","guestpost"]}},
      status:{$in: [-5,-4]},
      _id:{$not: {$in: allPost?.map(item => item.order)}}
    };

    if (allCate.find((item) => item.name === category)) {
      initQuery["require.category"] = { $regex: category, $options: "i" };
    } else {
      initQuery["require.category"] = {
        $not: { $in: allCate.map((item) => item.name) },
      };
    }

    let data = await OrderPost.find(initQuery).select("require user");
    let randomData = lodash.sampleSize(data, count);

    return res.json(randomData);
  } catch (error) {
    console.log(error);
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
  const {title, description, category, keywords, words, user} = req.body;
  try {
   const data =  await OrderPost.create({
      require: {
        title,
        description,
        category,
        keywords,
        words
      },
      user
    })
    return res.json({ success: true, message: "Tạo order post success", data });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      error,
    });
  }
}


const getPagingOrderPost =  async (req, res) => {
  try {
   const data =  await OrderPost.find({});
    return res.json(data);
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
  getPagingOrderPost
};
