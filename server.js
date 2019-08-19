const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const sitesRouter = require("./routers/sites");
let _ = require("lodash");

const s3 = new AWS.S3();
const PORT = process.env.PORT || 8080;
const S3Bucket = process.env.S3_BUCKET_NAME;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sites", {
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(
  "/sites",
  (req, res, next) => {
    req.s3 = s3;
    req.S3Bucket = S3Bucket;
    next();
  },
  sitesRouter
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});
