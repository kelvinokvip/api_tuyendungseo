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

module.exports = {
  getRandomOrderForPostByCate,
};
