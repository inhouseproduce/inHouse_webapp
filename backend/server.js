const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const cors = require("cors");
const mongoose = require("mongoose");
const sitesRoutes = express.Router();
const sitesystemsRoutes = express.Router();
const stackRoutes = express.Router();
const moduleRoutes = express.Router();
let _ = require("lodash");
const s3 = new AWS.S3({
  accessKeyId: "AKIARNKT2KGIPAUBW6ER",
  secretAccessKey: "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"
});
const PORT = 4000;

let { Sites, Sitesystems, Stacks, Modules } = require("./sites.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/sites", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

sitesRoutes.route("/").get(function(req, res) {
  Sites.find(function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

sitesRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Sites.findById(id, function(err, sites) {
    res.json(sites);
  });
});

sitesRoutes.route("/update/:id").post(function(req, res) {
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

sitesRoutes.route("/:id").delete(function(req, res) {
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

sitesRoutes.route("/add").post(function(req, res) {
  let sites = new Sites(req.body);
  sites
    .save()
    .then(sites => {
      res.status(200).json({ sites: "sites added successfully" });
      try {
        s3.putObject(
          {
            Bucket: "inhouseproduce-sites",
            Key: "site_" + sites._id + "/"
          },
          function(resp) {
            console.log(arguments);
            console.log("Successfully uploaded site.");
          }
        );
      } catch (error) {
        console.log(error);
      }
    })
    .catch(err => {
      res.status(400).send("adding new sites failed");
    });
});

app.use("/sites", sitesRoutes);

sitesystemsRoutes.route("/").get(function(req, res) {
  Sitesystems.find(function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

sitesystemsRoutes.route("/systems/:id").get(function(req, res) {
  let id = req.params.id;
  Sites.findById(id, function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

sitesystemsRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Sitesystems.find({ sitesystem_siteid: id }, function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

sitesystemsRoutes.route("/add").post(function(req, res) {
  let sites = new Sitesystems(req.body);
  sites
    .save()
    .then(sites => {
      try {
        s3.putObject(
          {
            Bucket: "inhouseproduce-sites",
            Key:
              "site_" +
              sites.sitesystem_siteid +
              "/sitesystem_" +
              sites._id +
              "_hardwareid_" +
              sites.sitesystem_hardwareid +
              "/"
          },
          function(resp) {
            console.log(arguments);
            console.log("Successfully uploaded sitesystem.");
          }
        );
      } catch (error) {
        console.log(errir);
      }

      res.status(200).json({ sites: "sitesystem added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new sitesystem failed");
    });
});

sitesystemsRoutes.route("/:id").delete(function(req, res) {
  let id = req.params.id;
  Sitesystems.findByIdAndDelete(id, function(err) {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

sitesystemsRoutes.route("/update/:id").post(function(req, res) {
  Sitesystems.findById(req.params.id, function(err, sites) {
    if (!sites) res.status(404).send("data is not found");
    else sites.sitesystem_updatedat = req.body.sitesystem_updatedat;

    sites
      .save()
      .then(sites => {
        res.json("Sitesystem updated!");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

app.use("/sitesystems", sitesystemsRoutes);

stackRoutes.route("/").get(function(req, res) {
  Stacks.find(function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      console.log(sites);
      res.json(sites);
    }
  });
});

stackRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Stacks.find({ stack_sitesystemid: id }, function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

stackRoutes.route("/add").post(function(req, res) {
  let siteid = req.body.stack_siteid;
  let sitesystemid = req.body.stack_sitesystemid;
  Sitesystems.find({ _id: sitesystemid }, function(err, sitesystem) {
    if (err) {
      console.log(err);
    } else {
      let hardwareid = sitesystem[0].sitesystem_hardwareid;
      let data = _.pick(
        req.body,
        "stack_createdat",
        "stack_sitesystemid",
        "stack_name"
      );
      let sites = new Stacks(data);
      sites
        .save()
        .then(sites => {
          try {
            s3.putObject(
              {
                Bucket: "inhouseproduce-sites",
                Key:
                  "site_" +
                  siteid +
                  "/" +
                  "sitesystem_" +
                  sitesystemid +
                  "_hardwareid_" +
                  hardwareid +
                  "/" +
                  sites.stack_name +
                  "/"
              },
              function(resp) {
                console.log(arguments);
                console.log("Successfully uploaded stack.");
              }
            );
          } catch (error) {
            console.log(error);
          }
          res.status(200).json({ sites: "stack added successfully" });
        })
        .catch(err => {
          res.status(400).send("adding new stack failed");
        });
    }
  });
});

stackRoutes.route("/:id").delete(function(req, res) {
  let id = req.params.id;
  Stacks.findByIdAndDelete(id, function(err) {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

app.use("/stacks", stackRoutes);

moduleRoutes.route("/").get(function(req, res) {
  Modules.find(function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

moduleRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Modules.find({ module_stackid: id }, function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

moduleRoutes.route("/add").post(function(req, res) {
  let siteid = req.body.module_siteid;
  let sitesystemid = req.body.module_sitesystemid;
  let stackid = req.body.module_stackid;
  Sitesystems.find({ _id: sitesystemid }, function(err, sitesystem) {
    if (err) {
      console.log(err);
    } else {
      let hardwareid = sitesystem[0].sitesystem_hardwareid;
      Stacks.find({ _id: stackid }, function(err, stack) {
        if (err) {
          console.log(err);
        } else {
          let stackname = stack[0].stack_name;
          let data = _.pick(
            req.body,
            "module_cropname",
            "module_imageurl",
            "module_cameranum",
            "module_updatedat",
            "module_createdat",
            "module_stackid"
          );
          let sites = new Modules(data);
          sites
            .save()
            .then(sites => {
              try {
                s3.putObject(
                  {
                    Bucket: "inhouseproduce-sites",
                    Key:
                      "site_" +
                      siteid +
                      "/" +
                      "sitesystem_" +
                      sitesystemid +
                      "_hardwareid_" +
                      hardwareid +
                      "/" +
                      stackname +
                      "/" +
                      "module_" +
                      sites._id +
                      "_camera_" +
                      sites.module_cameranum +
                      "/"
                  },
                  function(resp) {
                    console.log(arguments);
                    console.log("Successfully uploaded site.");
                  }
                );
              } catch (error) {
                console.log(error);
              }
              res.status(200).json({ sites: "module added successfully" });
            })
            .catch(err => {
              res.status(400).send("adding new module failed");
            });
        }
      });
    }
  });
});

moduleRoutes.route("/:id").delete(function(req, res) {
  let id = req.params.id;
  Modules.findByIdAndDelete(id, function(err) {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

moduleRoutes.route("/:id").delete(function(req, res) {
  let id = req.params.id;
  Modules.findByIdAndDelete(id, function(err) {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

moduleRoutes.route("/systems/:id").get(function(req, res) {
  console.log("inside edit module");
  let id = req.params.id;
  Modules.findById(id, function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

moduleRoutes.route("/update/:id").post(function(req, res) {
  Modules.findById(req.params.id, function(err, sites) {
    if (!sites) res.status(404).send("data is not found");
    else sites.module_cropname = req.body.module_cropname;
    sites.module_imageurl = req.body.module_imageurl;
    sites.module_cameranum = req.body.module_cameranum;
    sites.module_stackid = req.body.module_stackid;
    sites.module_updatedat = req.body.module_updatedat;

    sites
      .save()
      .then(sites => {
        res.json("Module updated!");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

app.use("/modules", moduleRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
