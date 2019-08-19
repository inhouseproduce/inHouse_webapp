const express = require("express");
const sitesRouter = express.Router();
const sitesystemsRouter = require("./sitesystems");

let { Sites } = require("../sites.model");

// get sites
sitesRouter.route("/").get((req, res) => {
  Sites.find((err, sites) => {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

// get site by name
sitesRouter.route("/:id").get((req, res) => {
  let id = req.params.id;
  Sites.find({ sites_name: id }, (err, sites) => {
    if (!sites || sites.length === 0) res.status(404).send("data is not found");
    else {
      res.json(sites[0]);
    }
  });
});

// update site
sitesRouter.route("/update/:id").post((req, res) => {
  Sites.find({ sites_name: req.params.id }, (err, sites) => {
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

// delete site
sitesRouter.route("/:id").delete((req, res) => {
  let id = req.params.id;
  Sites.findOneAndDelete({ sites_name: id }, err => {
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

// add site
sitesRouter.route("/add").post((req, res) => {
  let sites = new Sites(req.body);
  sites
    .save()
    .then(sites => {
      res.status(200).json({ sites: "sites added successfully" });
      try {
        req.s3.putObject(
          {
            Bucket: req.S3Bucket,
            Key: `${sites.sites_name}/`
          },
          resp => {
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

sitesRouter.use(
  "/:id/sitesystems",
  (req, res, next) => {
    req.siteid = req.params.id;
    next();
  },
  sitesystemsRouter
);

module.exports = sitesRouter;
