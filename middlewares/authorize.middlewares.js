const jwt = require("express-jwt");
const { secret } = require("../config/auth.config");
// const db = require('_helpers/db');
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const Role = require("../models/role.model");
const permissionModule = require("../models/permission.model");

function authorize(func = "", permission = "") {
  0.0;
  return [
    jwt({ secret, algorithms: ["HS256"] }),
    async (req, res, next) => {
      try {
        const user = await User.findById(req.user.id).populate("team");
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const roles = await Role.findOne({
          _id: user.role,
        });
        if (func && permission) {
          const permissionField = await permissionModule.findOne({
            name: func,
            role: user.role,
          });
          if (!permissionField)
            return res.status(401).json({ message: "Can not access " + func });
          checkFlag = permissionField[permission] ? true : false;
          if (!checkFlag)
            return res
              .status(401)
              .json({ message: "Can not access" + func + "by" + permission });
        }

        if (user.team?.length > 0) {
          req.user.team = user.team;
        }
        req.user.name = user.lastName;
        req.user.username = user.username;
        req.user.role = roles;
        req.user.telegram = user?.telegram;

        req.user.whatsapp = user?.whatsapp;

        const refreshTokens = await RefreshToken.find({ user: user.id });
        req.user.ownsToken = (token) =>
          !!refreshTokens.find((x) => x.token === token);
        next();
      } catch (error) {
        console.log(error);
        return res.status(500);
      }

      // authentication and authorization successful
    },
  ];
}
module.exports = authorize;
