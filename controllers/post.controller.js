const unidecode = require("unidecode");
const PagedModel = require("../helpers/PagedModel");
const Post = require("../models/post.model");
const OrderPost = require("../models/order.model");
const User = require("../models/user.model");
const moment = require("moment/moment");
const lodash = require("lodash");
const Notification = require("../models/notification.model");

const getPagingPost = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const search = req.query.search;
    const category = req.query.category;
    const status = req.query.status;
    let searchObject = {};
    let aggregationPipeline = [];

    if (search) {
      searchObject = {
        $or: [
          {
            title: { $regex: search, $options: "i" },
          },
          {
            keyword: { $regex: search, $options: "i" },
          },
        ],
      };
    }

    if (category) {
      searchObject.category = category;
    }

    aggregationPipeline.push({ $match: searchObject });

    if (status) {
      if (status == 5) {
        aggregationPipeline.push({
          $match: {
            status: { $in: [1, 2, -2] },
          },
        });
        aggregationPipeline.push({
          $addFields: {
            timeDifference: {
              $subtract: ["$receive.finishTime", "$receive.receiveTime"],
            },
          },
        });
        aggregationPipeline.push({ $sort: { timeDifference: 1 } });
      } else {
        aggregationPipeline.push({
          $match: {
            status: parseInt(status),
          },
        });
        aggregationPipeline.push({ $sort: { createdAt: -1 } });
      }
    }

    aggregationPipeline.push(
      { $skip: pageSize * (pageIndex - 1) },
      { $limit: pageSize }
    );

    const data = await Post.aggregate(aggregationPipeline);

    const userIds = [
      ...data.map((item) => item.receive?.user),
      ...data.map((item) => item.censor?.user),
    ];

    const listUserData = await User.find({ _id: { $in: userIds } }, ["username"]);

    const listPost = data.map((item) => {
      item.receive.user = listUserData.find(
        (itemUser) => itemUser._id.toString() === item.receive?.user.toString()
      );
      if (item.censor.user) {
        item.censor.user = listUserData.find(
          (itemUser) => itemUser._id.toString() === item.censor.user.toString()
        );
      }
      return item;
    });

    const count = await Post.countDocuments(searchObject);
    const totalPage = Math.ceil(count / pageSize);

    const response = new PagedModel(
      pageIndex,
      pageSize,
      totalPage,
      listPost,
      count
    );

    return res.json(response);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
      error,
    });
  }
};
const getById = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findOne({ _id: id });

    if (!post) {
      return res.json({ success: false, message: "Bài viết không tồn tại!" });
    } else {
      return res.json({ success: true, data: post });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};
const create = async (req, res) => {
  try {
    const { title, description, category, keywords, status, timer, order } =
      req.body;

    const check = await Post.findOne({ title: title.trim() });

    if (check) {
      return res.json({ success: false, message: "Tiêu đề này đã tồn tại!" });
    }
    const newPost = new Post({
      title: title.trim(),
      description,
      category,
      keywords,
      status,
      timer,
      order,
      nameNoSign: unidecode(title).toLocaleLowerCase(),
    });

    await newPost.save();

    return res.json({ success: true, message: "Tạo thành công!", newPost });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};
const update = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findOne({ _id: id });
    if (!post) {
      return res.json({ success: false, message: "Bài viết không tồn tại!" });
    }

    const result = await Post.findOneAndUpdate({ _id: id }, req.body);

    return res.json({ success: true, message: "Sửa bài viết thành công!" });
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

    const result = await Post.findOneAndDelete({ _id: id });

    if (!result) {
      return res.json({ success: false, message: "Bài viết không tồn tại!" });
    } else {
      return res.json({ success: true, message: "Xóa thành công!" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};

const receivePost = async (req, res) => {
  try {
    const user = req.user.id;
    const orderId = req.params.id;
    const checkExists = await Post.findOne({ order: orderId });
    if (checkExists) {
      return res.json({
        success: false,
        message: "Bài viết đã có người nhận!",
      });
    }
    const checkCurrent = await Post.findOne({
      status: { $in: [0] },
      "receive.user": req.user.id,
    });
    if (checkCurrent) {
      return res.json({ success: false, message: "Bạn còn bài đang viết!" });
    }
    const order = await OrderPost.findOne({ _id: orderId })
      .select("require")
      .lean();
    console.log(order);
    const newPost = new Post({
      title: order.require.title,
      description: order.require.description,
      category: order.require.category,
      keywords: order?.require?.keywords,
      status: 0,
      timer: 3,
      order: order?._id,
      word: order?.require?.words,
      receive: {
        user: user,
        receiveTime: moment().toISOString(),
        // deadline: moment().add(2, "hour").toISOString(),
      },
      nameNoSign: unidecode(
        `${order.require.title} ${
          order.require.category
        } ${order.require?.keywords?.map((item) => item).toString()}`
      ).toLowerCase(),
    });

    await newPost.save();

    return res.json({
      success: true,
      message: "Nhận bài viết thành công!",
      newPost,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
const receiveRandomPost = async (req, res) => {
  try {
    const user = req.user.id;
    const category = req.body.category;
    console.log(category);
    const checkCurrent = await Post.findOne({
      status: { $in: [0] },
      "receive.user": req.user.id,
    });
    if (checkCurrent) {
      return res.json({ success: false, message: "Bạn còn bài đang viết!" });
    }
    const checkPost = await Post.findOne({
      "receive.user": req.user.id
    });
    if (checkPost) {
      return res.json({ success: false, message: "Mỗi tài khoản chỉ được làm bài test một lần" });
    }

    const allPost = await Post.find({status: 0}).select("order");

    let initQuery = {  
      "require.category": { $regex: category, $options: "i" },
      _id: { $nin: allPost?.map((item) => item.order) },
    };

    let data = await OrderPost.find(initQuery).select("require").lean();
    if (data?.length === 0) {
      data = await OrderPost.find({"require.category": { $regex: category, $options: "i" }}).select("require").lean();
      if(data?.length === 0){
        return res.json({
          success: false,
          message: "Không còn bài viết để nhận!",
        });
      }
    }
    let randomData = lodash.sampleSize(data, 1);
 
    const newPost = new Post({
      title: randomData[0].require.title,
      description: randomData[0].require.description,
      category: randomData[0].require.category,
      keywords: randomData[0]?.require?.keywords,
      status: 0,
      timer: 2,
      order: randomData[0]?._id,
      word: randomData[0]?.require?.words,
      receive: {
        user: user,
        receiveTime: moment().toISOString(),
        // deadline: moment().add(2, "hour").toISOString(),
      },
      nameNoSign: unidecode(
        `${randomData[0].require.title} ${
          randomData[0].require.category
        } ${randomData[0].require?.keywords?.map((item) => item).toString()}`
      ).toLowerCase(),
    });

    await newPost.save();

    return res.json({
      success: true,
      message: "Nhận bài viết thành công!",
      // newPost,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal server error!" });
  }
};
const finishPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content, word } = req.body;
    const expires = Boolean(req.body.expires);
    console.log(expires, "asdasdsadasdasdsadasdasd");
    const post = await Post.findOne({
      _id: postId,
      "receive.user": userId.toString(),
    });
    if (!post) {
      return res.json({
        success: false,
        message: "Bài viết này không phải của bạn!",
      });
    }
    if (post.status !== 0) {
      return res.json({
        success: false,
        message: "Bài viết đã hoàn thành hoặc hết hạn!",
      });
    }
    if (!expires) {
      if (!title || !content) {
        return res.json({
          success: false,
          message: "Vui lòng điền đầy đủ thông tin!",
        });
      }
    }

    post.receive.finishTime = moment().toISOString();
    post.receive.title = title;
    post.receive.content = content;
    post.receive.word = word;
    post.status = expires ? -1 : 1;
    await post.save();

    if (!expires) {
      return res.json({
        success: true,
        message:
          "Nộp bài thành công, vui lòng chờ quản trị viên đánh giá bài viết của bạn!",
      });
    }
    if (post.status === -1) {
      return res.json({
        success: false,
        message: "Bài viết của bạn đã hết hạn!",
        expires,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};
const getMyPost = async (req, res) => {
  try {
    await checkExpiresPost();
    const user = req.user.id;
    const pageSize = req.query.pageSize || 10;
    const pageIndex = req.query.pageIndex || 1;
    const search = req.query.search;
    const status = req.query.status;
    let searchQuery = {
      "receive.user": user,
    };

    if (search) {
      searchQuery.nameNoSign = { $regex: search, $options: "i" };
    }

    if (status) {
      searchQuery.status = status;
    }

    const data = await Post.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageIndex - 1))
      .limit(pageSize);

    const count = await Post.countDocuments(searchQuery);

    const totalPage = Math.ceil(count / pageSize);

    const response = new PagedModel(
      pageIndex,
      pageSize,
      totalPage,
      data,
      count
    );

    return res.json(response);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};
const startPost = async (req, res) => {
  try {
    const postid = req.params.id;
    const user = req.user.id;
    const post = await Post.findOne({ "receive.user": user, _id: postid });

    if (!post) {
      return res.json({
        success: false,
        message: "Bạn không có quyền viết bài này",
      });
    }
    if (!post.receive?.deadline) {
      post.receive.deadline = moment()
        .add(post.timer, "hour").add(5, "minutes")

        .toISOString();

      await post.save();
    }

    return res.json({ success: true, message: "Bắt đầu viết bài!", post });
  } catch (error) {
    return res.json({ success: false, message: "Internal server error!" });
  }
};
const checkExpiresPost = async (req, res) => {
  try {
    const time = moment().toISOString();
    const searchQuery = {
      status: 0,
      "receive.deadline": { $lte: time },
    };

    const checkPost = await Post.updateMany(searchQuery, {
      $set: { status: -1 },
    });

    return;
  } catch (error) {
    console.log(error);
  }
};

const updateStatusPost = async (req, res) => {
  try {
    const { status, note } = req.body;
    const userid = req.user.id;
    const id = req.params.id;
    if (!status || !note) {
      return res.json({
        success: false,
        message: "Vui lòng nhập nội dung đánh giá!",
      });
    }
    const post = await Post.findOne({ _id: id });

    if (!post) {
      return res.json({ success: false, message: "Bài viết không tồn tại!" });
    }
    if(status == 2){
      const title = "KẾT QUẢ BÀI VIẾT"
      const message = `<div><span style="color: rgb(255, 0, 0); font-weight: bold;">ĐẠT</span><span style="">. 
      Chào mừng bạn tham gia vào hệ thống CTV của OKVIP. Tài khoản này đã được liên kết với trang web </span><span style="">https://seo.okvip.vin/</span><span style=""> 
      Liên hệ hỗ trợ qua nhóm telegram: https://t.me/freelancer_okvip
      </span></div>`
      await Notification.create({
        userIds: [post.receive.user],
        title,
        message,
        type: "2",
      })
    }
    if(status == -2){
      const title = "KẾT QUẢ BÀI VIẾT"
      const message = `<div><span style="">Kết quả bài viết của bạn: </span><span style="color: rgb(255, 0, 0); font-weight: bold;">KHÔNG ĐẠT</span><span style="">. Lưu ý: Mỗi tài khoản chỉ được tham gia bài test một lần!
      </span></div>`
      await Notification.create({
        userIds: [post.receive.user],
        title,
        message,
        type: "2"
      })
    }
    post.status = status;
    post.censor.user = userid;
    post.censor.note = note;
    post.censor.date = new Date();
    await post.save();

    return res.json({
      success: true,
      message: "Cập nhật trạng thái bài viết thành công!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
const updateDeadlinePost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findOne({ _id: id });
    if (!post) {
      return res.json({ success: false, message: "Bài viết không tồn tại!" });
    }

    post.receive.deadline = moment().add(post.timer, "hour");
    await post.save();

    return res.json({ success: true, post });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};
module.exports = {
  getPagingPost,
  create,
  update,
  remove,
  getById,
  receivePost,
  finishPost,
  getMyPost,
  startPost,
  checkExpiresPost,
  updateStatusPost,
  receiveRandomPost,
  updateDeadlinePost
};
