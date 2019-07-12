const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = 4000;

let Sites = require("./sites.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/sites", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

todoRoutes.route("/").get(function(req, res) {
  Sites.find(function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

todoRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Sites.findById(id, function(err, sites) {
    res.json(sites);
  });
});

todoRoutes.route("/update/:id").post(function(req, res) {
  Sites.findById(req.params.id, function(err, sites) {
    if (!sites) res.status(404).send("data is not found");
    else sites.sites_name = req.body.sites_name;
    sites.sites_location = req.body.sites_location;
    sites.sites_updatedat = req.body.sites_updatedat;

    sites
      .save()
      .then(sites => {
        res.json("Sites updated!");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

todoRoutes.route("/:id").delete(function(req, res) {
  let id = req.params.id;
  Sites.findByIdAndDelete(id, function(err) {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

todoRoutes.route("/add").post(function(req, res) {
  let sites = new Sites(req.body);
  sites
    .save()
    .then(sites => {
      res.status(200).json({ sites: "sites added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new sites failed");
    });
});

app.use("/sites", todoRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
