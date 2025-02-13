const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

const db = require("./config/mongoose-connection");
const stockModel = require("./models/stock-model");

const indexRouters = require("./routers/index-router");
const usersRouters = require("./routers/user-router");
const adminRouters = require("./routers/admin-router");

const {
  registerUser,
  loginUser,
  logout,
} = require("./controller/authController");
const isAuth = require("./middleware/isAuth");

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

app.use("/", indexRouters);
app.use("/admin", adminRouters);
app.use("/user", usersRouters);


app.listen(8080);
