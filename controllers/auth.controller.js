const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const RefreshToken = require("../models/refreshToken.model");
const crypto = require("crypto");
const Role = require("../models/role.model");
const axios = require("axios");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        status: 0,
        message: "Tài khoản không tồn tại!",
      });
    }
    user.role = await Role.findOne({ _id: user.role });
    const ipAddress = req.ip;

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.json({
        success: false,
        status: 0,
        message: "Tài khoản hoặc mật khẩu không đúng!",
      });
    }
    if (user.isVerify === 0) {
      return res.json({
        success: false,
        message:
          "Tài khoản của bạn bị khóa, vui lòng liên hệ quản trị viên để biết thêm chi tiết!",
      });
    }
    // if (user.status === 1 ) {
    //   return res.json({
    //     success: false,
    //     message: "Tài khoản của bạn đã được duyệt vào web chính!",
    //   });
    // }
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, ipAddress);
    await refreshToken.save();

    setTokenCookie(res, refreshToken.token);
    req.user = user;

    const returnObject = {
      ...basicDetails(user),
      success: true,
      jwtToken,
      refreshToken: refreshToken.token,
    };
    return res.json(returnObject);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal Server Error!",
      error,
    });
  }
};

// signup

const register = async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const check = await User.findOne({
      username: username.toLowerCase().trim(),
    });
    if (check) {
      return res.json({ success: false, message: "Tên đăng nhập đã tồn tại!" });
    }
    const role = await Role.findOne({
      name: { $regex: ".*" + "CTV" + ".*" },
    });
    const ipAddress = req.ip;
    const user = new User({
      username,
      passwordHash: bcrypt.hashSync(password, 10),
      firstName,
      lastName,
      role: role._id,
      status: 0,
      isVerify: 1,
    });
    const userDetail = await user.save();
    userDetail.role = role;
    const jwtToken = generateJwtToken(userDetail);
    const refreshToken = generateRefreshToken(user, ipAddress);
    await refreshToken.save();
    setTokenCookie(res, refreshToken);
    const returnObject = {
      ...basicDetails(userDetail),
      success: true,
      message: "Đăng ký thành công!",
      jwtToken,
      refreshToken: refreshToken.token,
    };
    return res.json(returnObject);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//Login with google
const loginWithGoogle = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    const verifyToken = await axios({
      method: "GET",
      url: `https://oauth2.googleapis.com/tokeninfo?access_token=${tokenId}`,
      withCredentials: true,
    });
    if (verifyToken.status === 200) {
      //const { email_verified, email, name, picture } = verifyToken.data;
      const userData = await axios({
        method: "GET",
        url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenId}`,
        withCredentials: true,
      });
      const { id, given_name, family_name, picture, name, email } =
        userData.data;
      //  const { email_verified, email, name, picture } = verifyToken.data;

      const checkValidEmail = await User.findOne({ email: email });
      const ipAddress = req.ip;

      if (!checkValidEmail) {
        //
        const role = await Role.findOne({
          name: { $regex: ".*" + "CTV" + ".*" },
        });
        const user = new User({
          firstName: given_name,
          lastName: family_name,
          email: email,
          avatar: picture,
          username: name,
          passwordHash: bcrypt.hashSync("quy3935693", 10),
          role: role._id,
          status: 0,
          isVerify: 1,
        });
        const userDetail = await user.save();
        userDetail.role = role;
        const jwtToken = generateJwtToken(userDetail);
        const refreshToken = generateRefreshToken(user, ipAddress);
        await refreshToken.save();
        setTokenCookie(res, refreshToken);
        const returnObject = {
          ...basicDetails(user),
          success: true,
          message: "Đăng ký thành công!",
          jwtToken,
          refreshToken: refreshToken.token,
        };
        return res.json(returnObject);
      } else {
        checkValidEmail.role = await Role.findOne({
          _id: checkValidEmail.role,
        });
        const jwtToken = generateJwtToken(checkValidEmail);
        const refreshToken = generateRefreshToken(checkValidEmail, ipAddress);
        await refreshToken.save();
        const returnObject = {
          ...basicDetails(checkValidEmail),
          success: true,
          jwtToken,
          refreshToken: refreshToken.token,
          message: "Đăng nhập thành công!",
        };
        return res.json(returnObject);
      }
    } else {
      const response = {
        message: "Token không lệ ",
        status: RESPONSE_STATUS.FAILED,
        user: null,
      };
      return res.status(200).json(response);
    }
  } catch (error) {
    next(error);
  }
};
//Logged
const loggedUser = async (req, res, next) => {
  try {
    const user = req?.user;
    const ipAddress = req.ip;
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, ipAddress);
    await refreshToken.save();
    user.role = await Role.findOne({ _id: user.role });
    const returnObject = {
      ...basicDetails(user),
      success: true,
      jwtToken,
      refreshToken: refreshToken.token,
      message: "Thành công!",
    };
    return res.json(returnObject);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//
function generateJwtToken(user) {
  // create a jwt token containing the user id that expires in 15 minutes (mới set lại 360 phút)
  return jwt.sign(
    { sub: user.id, id: user.id, iat: Date.now() },
    process.env.JWT_SECRET,
    {
      expiresIn: "10s",
    }
  );
}

function generateRefreshToken(user, ipAddress) {
  // create a refresh token that expires in 7 days
  return new RefreshToken({
    user: user?.id || user?._id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  });
}
function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

function basicDetails(user) {
  const { id, firstName, lastName, username, role, avatar, status } = user;
  return {
    id,
    firstName,
    lastName,
    username,
    role,
    avatar,
    status,
  };
}

function setTokenCookie(res, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: false,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  res.cookie("refreshToken", token, cookieOptions);
}

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) {
      return res.json({ success: false, message: "Token not found!" });
    }

    let refreshToken = await RefreshToken.findOne({
      token: token,
    });

    refreshToken.user = await User.findOne({ _id: refreshToken.user });

    if (!refreshToken) {
      return res.json({ success: false, message: "Refresh token not found!" });
    }

    const { user } = refreshToken;

    const newRefreshToken = generateRefreshToken(user, ipAddress);

    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;

    await refreshToken.save();
    await newRefreshToken.save();

    const jwtToken = generateJwtToken(user);

    setTokenCookie(res, refreshToken.token);
    return res.json({
      ...basicDetails(user),
      success: true,
      jwtToken,
      refreshToken: refreshToken.token,
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

module.exports = { login, register, loginWithGoogle, loggedUser, refreshToken };
