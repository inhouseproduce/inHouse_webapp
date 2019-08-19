const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const sitesRoutes = express.Router();
let _ = require("lodash");

const s3 = new AWS.S3();
const PORT = process.env.PORT || 8080;
const S3Bucket = process.env.S3_BUCKET_NAME;

let { Sites, Sitesystems, Stacks, Modules } = require("./sites.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sites", {
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

// get all sites
sitesRoutes.route("/").get(function(req, res) {
  Sites.find(function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

// get site by name
sitesRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Sites.find({ sites_name: id }, function(err, sites) {
    if (!sites || sites.length === 0) res.status(404).send("data is not found");
    else {
      res.json(sites[0]);
    }
  });
});

// get sitesystems by site name
sitesRoutes.route("/:siteid/sitesystems").get(function(req, res) {
  let id = req.params.siteid;
  Sitesystems.find({ sitesystem_siteid: id }, function(err, sites) {
    if (!sites || sites.length === 0) res.status(404).send("data is not found");
    else {
      res.json(sites);
    }
  });
});

// get sitesystems by hardware id
sitesRoutes.route("/:siteid/sitesystems/:id").get(function(req, res) {
  let id = req.params.id;
  Sitesystems.find({ sitesystem_hardwareid: id }, function(err, sites) {
    if (!sites || sites.length === 0) res.status(404).send("data is not found");
    else {
      console.log(sites[0]);
      res.json(sites[0]);
    }
  });
});

// get stacks by sitesystem hardware id
sitesRoutes
  .route("/:siteid/sitesystems/:sitesystemid/stacks")
  .get(function(req, res) {
    let id = req.params.sitesystemid;
    Stacks.find({ stack_sitesystemid: id }, function(err, sites) {
      if (!sites || sites.length === 0)
        res.status(404).send("data is not found");
      else {
        res.json(sites);
      }
    });
  });

// get modules related to stack
sitesRoutes
  .route("/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules")
  .get(function(req, res) {
    let id = req.params.sitesystemid + "_" + req.params.stackid;
    console.log(id);
    Modules.find({ module_stackid: id }, function(err, sites) {
      if (!sites || sites.length === 0)
        res.status(404).send("data is not found");
      else {
        const prefix =
          req.params.siteid +
          "/" +
          req.params.sitesystemid +
          "/" +
          req.params.stackid;
        let count = 0;
        for (site of sites) {
          try {
            s3.listObjectsV2(
              {
                Bucket: S3Bucket,
                Prefix: prefix + "/" + site.module_name + "/",
                Delimiter: "/"
              },
              function(err, resp) {
                const module_name = resp.Prefix.split("/").slice(-2, -1)[0];
                let Site = sites.find(
                  element => element.module_name === module_name
                );
                if (err || (resp.Contents && resp.Contents.length <= 1)) {
                  Site.module_imageurl = "";
                } else {
                  const latest = resp.Contents.filter(
                    element => element.Size !== 0
                  ).reduce(function(prev, current) {
                    return prev.LastModified > current.LastModified
                      ? prev
                      : current;
                  });
                  Site.module_imageurl =
                    "/sites/" +
                    req.params.siteid +
                    "/sitesystems/" +
                    req.params.sitesystemid +
                    "/stacks/" +
                    req.params.stackid +
                    "/modules/" +
                    Site.module_name +
                    "/images/" +
                    latest.Key.split("/").pop();
                }
                count++;
                if (count === sites.length) {
                  res.json(sites);
                }
              }
            );
          } catch (error) {
            site.module_imageurl = "";
          }
        }
      }
    });
  });

// get modules by module name
sitesRoutes
  .route("/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules/:id")
  .get(function(req, res) {
    let id = req.params.id;
    //console.log(id);
    let mod_stackid = req.params.sitesystemid + "_" + req.params.stackid;
    //console.log(mod_stackid);
    Modules.find({ module_name: id, module_stackid: mod_stackid }, function(
      err,
      sites
    ) {
      // console.log(sites);
      if (!sites || sites.length === 0)
        res.status(404).send("data is not found");
      else {
        res.json(sites[0]);
      }
    });
  });

// get module image by name
sitesRoutes
  .route(
    "/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules/:id/images/:name"
  )
  .get(function(req, res) {
    const key =
      req.params.siteid +
      "/" +
      req.params.sitesystemid +
      "/" +
      req.params.stackid +
      "/" +
      req.params.id +
      "/" +
      req.params.name;
    try {
      s3.getObject({ Bucket: S3Bucket, Key: key }, function(err, resp) {
        if (err) {
          if (err.statusCode === 404) {
            return res.status(404).send("Image not Found");
          }
          return res.status(400).send("Could not get image");
        }
        res.set("Content-Type", resp.ContentType);
        res.send(resp.Body);
      });
    } catch (error) {
      console.log(error);
    }
  });

//update sites
sitesRoutes.route("/update/:id").post(function(req, res) {
  Sites.find({ sites_name: req.params.id }, function(err, sites) {
    if (!sites || sites.length === 0) res.status(404).send("data is not found");
    else {
      sites[0].sites_name = req.body.sites_name;
      sites[0].sites_location = req.body.sites_location;
      sites[0].sites_updatedat = req.body.sites_updatedat;

      console.log(sites);

      sites[0]
        .save()
        .then(sites => {
          res.json("Sites updated!");
        })
        .catch(err => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

//update sitesystems
sitesRoutes.route("/:siteid/sitesystems/update/:id").post(function(req, res) {
  Sitesystems.find({ sitesystem_hardwareid: req.params.id }, function(
    err,
    sites
  ) {
    if (!sites || sites.length === 0) res.status(404).send("data is not found");
    else {
      //console.log(req.body.sitesystem_timers);
      sites[0].sitesystem_updatedat = req.body.sitesystem_updatedat;
      sites[0].sitesystem_hardwareid = req.body.sitesystem_hardwareid;
      sites[0].sitesystem_name = req.body.sitesystem_name;
      sites[0].sitesystem_temp = req.body.sitesystem_temp;
      sites[0].sitesystem_humidity = req.body.sitesystem_humidity;
      sites[0].sitesystem_timers = req.body.sitesystem_timers;
    }

    sites[0]
      .save()
      .then(sites => {
        console.log(sites);
        res.json("Sitesystem updated!");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

// update modules
sitesRoutes
  .route(
    "/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules/update/:id"
  )
  .post(function(req, res) {
    let mod_stackid = req.params.sitesystemid + "_" + req.params.stackid;
    Modules.find(
      { module_name: req.params.id, module_stackid: mod_stackid },
      function(err, sites) {
        if (!sites || sites.length === 0)
          res.status(404).send("data is not found");
        else {
          sites[0].module_cropname = req.body.module_cropname;
          sites[0].module_cameranum = req.body.module_cameranum;
          sites[0].module_updatedat = req.body.module_updatedat;
        }

        sites[0]
          .save()
          .then(sites => {
            res.json("Module updated!");
          })
          .catch(err => {
            res.status(400).send("Update not possible");
          });
      }
    );
  });

//delete sites
sitesRoutes.route("/:id").delete(function(req, res) {
  let id = req.params.id;
  Sites.findOneAndDelete({ sites_name: id }, function(err) {
    if (!err) {
      console.log("pass");
      res.sendStatus(200);
    } else {
      console.log("pass");
      res.status(500).json({
        error: err
      });
    }
  });
});

//delete sitesystems
sitesRoutes.route("/:siteid/sitesystems/:id").delete(function(req, res) {
  let id = req.params.id;
  Sitesystems.findOneAndDelete({ sitesystem_hardwareid: id }, function(err) {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

//add sites
sitesRoutes.route("/add").post(function(req, res) {
  let sites = new Sites(req.body);
  sites
    .save()
    .then(sites => {
      res.status(200).json({ sites: "sites added successfully" });
      try {
        s3.putObject(
          {
            Bucket: S3Bucket,
            Key: sites.sites_name + "/"
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
      if (err.code == 11000) {
        res.status(401).send("Site with this name already exists");
      } else res.status(400).send("adding new sites failed");
    });
});

// add sitesystems
sitesRoutes.route("/:siteid/sitesystems/add").post(function(req, res) {
  let sites = new Sitesystems({ ...req.body, sitesystem_timers: [] });
  sites
    .save()
    .then(sites => {
      try {
        s3.putObject(
          {
            Bucket: S3Bucket,
            Key:
              req.params.siteid +
              "/" +
              sites.sitesystem_name +
              "_" +
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

// add stacks
sitesRoutes
  .route("/:siteid/sitesystems/:sitesystemid/stacks/add")
  .post(function(req, res) {
    let stacks = {};
    stacks.stack_sitesystemid = req.body.stack_sitesystemid;
    stacks.stack_createdat = req.body.stack_createdat;

    Stacks.find({ stack_sitesystemid: req.params.sitesystemid }, function(
      err,
      sites
    ) {
      console.log(sites.length);
      if (!sites || sites.length == 0) stacks.stack_name = "Stack1";
      else {
        let len = sites.length + 1;
        stacks.stack_name = "Stack" + len;
      }

      let stack = new Stacks(stacks);
      console.log(stack);
      stack
        .save()
        .then(stack => {
          try {
            s3.putObject(
              {
                Bucket: S3Bucket,
                Key:
                  req.params.siteid +
                  "/" +
                  req.params.sitesystemid +
                  "/" +
                  stacks.stack_name +
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
    });
  });

// add modules
sitesRoutes
  .route("/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules/add")
  .post(function(req, res) {
    let modules = {};
    modules.module_cropname = req.body.module_cropname;
    modules.module_createdat = req.body.module_createdat;
    modules.module_imageurl = req.body.module_imageurl;
    modules.module_cameranum = req.body.module_cameranum;
    modules.module_stackid = req.body.module_stackid;
    console.log(req.body.module_stackid);

    Modules.find({ module_stackid: req.body.module_stackid }, function(
      err,
      mod
    ) {
      console.log(mod);
      if (!mod || mod.length == 0) modules.module_name = "Module1";
      else {
        let len = mod.length + 1;
        modules.module_name = "Module" + len;
      }

      let module = new Modules(modules);
      console.log(module);
      module
        .save()
        .then(module => {
          try {
            s3.putObject(
              {
                Bucket: S3Bucket,
                Key:
                  req.params.siteid +
                  "/" +
                  req.params.sitesystemid +
                  "/" +
                  req.params.stackid +
                  "/" +
                  module.module_name +
                  "/"
              },
              function(resp) {
                console.log(arguments);
                console.log("Successfully uploaded module.");
              }
            );
          } catch (error) {
            console.log(error);
          }
          res.status(200).json({ sites: "module added successfully" });
        })
        .catch(err => {
          console.log(err);
          res.status(400).send("adding new module failed");
        });
    });
  });

app.use("/sites", sitesRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
