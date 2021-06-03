require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const routes = require("./routes");

// creating express app
let app = express();
let port = process.env.PORT || 8000;

// adding the middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// adding all the routes
app.use('/api', routes)

// connecting to database
mongoose
  .connect("mongodb://localhost:27017/otpauth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log(error);
  })


// Starting the app
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
