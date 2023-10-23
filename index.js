const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const Fingerprint = require("express-fingerprint");
require("./helpers/telegram")
var origin_urls;
if (process.env.NODE_ENV == "development") {
  origin_urls = [
    `${process.env.CLIENT_DEV_URL}`,
    `${process.env.ADMIN_DEV_URL}`,
  ];
} else if (process.env.NODE_ENV == "production") {
  origin_urls = [`${process.env.CLIENT_URL}`, `${process.env.ADMIN_URL}`];
}

const corsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  credentials: true,
  methods: "GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE",
  origin: origin_urls,
  preflightContinue: false,
};

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DATABASE_CLOUD)
  .then((res) => console.log("connected to DB"));

//app
const app = express();

app.use(cors(corsOptions));
app.use(fileUpload());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);
app.use(express.urlencoded({ limit: "100mb", parameterLimit: 500000000 }));

const server = require("http").createServer(app);

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server running on:${port}`);
});

app.use(
  Fingerprint({
    parameters: [
      // Defaults
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip,
    ],
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

//route
const User = require("./models/user.model");
const Role = require("./models/role.model");

const authRoute = require("./routes/auth.routes");
const permissionRoute = require("./routes/permission.routes");
const categoryRoute = require("./routes/category.routes");
const postRoute = require("./routes/post.routes");
const userRoute = require("./routes/user.routes");

app.use("/api", categoryRoute);
app.use("/api", authRoute);
app.use("/api/permission", permissionRoute);
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);
