const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const createError = require("./error.js");
const browser = require("browser-detect");

// verify token
const verifyToken = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  let token = authHeader && authHeader.split(" ")[1];
  token = token?.replace(/"/g, "");
  if (!token) {
    // return next(createError(401, 'You are not authenticated!'));
    return res.status(401).json({
      status: -1,
      message: "You are not authenticated!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // return next(createError(401, 'Access token is not valid!'));
      return res.status(401).json({
        status: -1,
        message: "Access token is not valid!",
      });
    }

    User.findById(user.id)
      .then((res) => {
        req.user = res;
        next();
      })
      .catch(() => {
        return next(createError(401, "Access token is not valid!"));
      });
  });
};

// verify user
const verifyUser = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user?._id?.toString() === req.params?.id ||
      req.user.role.name === "admin"
    ) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// verify publisher
const verifyPublisher = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role.name === "publisher" || req.user.role.name === "admin") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// verify advertiser
const verifyAdvertiser = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role.name === "advertiser" || req.user.role.name === "admin") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// verify admin
const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role.name === "admin") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

const getBrowserDetect = (req, res, next) => {
  // log login
  let location = "Không xác định";
  const ip = req.ip;
  const geo = geoip.lookup(ip);
  if (geo) {
    const { city, region, country } = geo;
    location = `${city}, ${region}, ${country}`;
  }

  const browserAndOs = browser(req.headers["user-agent"]);
  const browserDetect = {
    ip,
    location,
    browser: browserAndOs?.name
      ? `${browserAndOs.name} ${browserAndOs.version}`
      : "Không xác định",
    os: browserAndOs?.os || "Không xác định",
  };
  req.browserDetect = browserDetect;
  next();
};
module.exports = { verifyToken };
