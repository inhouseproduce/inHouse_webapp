// this is a router for all site related routes

const express = require("express");
const sitesRouter = express.Router();
const sitesystemsRouter = require("./sitesystems");

let { Sites } = require("../sites.model");

// get sites
sitesRouter.route("/").get((req, res) => {
  Sites.find((err, sites) => {
    if (err) {
      res.status(500).send("getting sites failed");
    } else {
      res.json(sites);
    }
  });
});

// get site by name
sitesRouter.route("/:id").get((req, res) => {
  let id = req.params.id;
  Sites.find({ sites_name: id }, (err, sites) => {
    if (err) {
      res.status(500).send("getting site failed");
    } else if (sites.length === 0) {
      res.status(404).send("site not found");
    } else {
      res.json(sites[0]);
    }
  });
});

// update site
sitesRouter.route("/update/:id").post((req, res) => {
  Sites.find({ sites_name: req.params.id }, (err, sites) => {
    if (err) {
      res.status(500).send("updating site failed");
    } else if (sites.length === 0) {
      res.status(404).send("site not found");
    } else {
      sites[0].sites_name = req.body.sites_name;
      sites[0].sites_location = req.body.sites_location;
      sites[0].sites_updatedat = req.body.sites_updatedat;
      sites[0]
        .save()
        .then(sites => {
          res.json("site updated!");
        })
        .catch(err => {
          res.status(500).send("updating site failed");
        });
    }
  });
});

// delete site
sitesRouter.route("/:id").delete((req, res) => {
  let id = req.params.id;
  Sites.findOneAndDelete({ sites_name: id }, err => {
    if (err) {
      res.status(500).send("deleting site failed");
    } else {
      res.json("site deleted!");
    }
  });
});

// add site
sitesRouter.route("/add").post((req, res) => {
  let sites = new Sites(req.body);
  sites
    .save()
    .then(sites => {
      try {
        req.s3.putObject(
          {
            Bucket: req.S3Bucket,
            Key: `${sites.sites_name}/`
          },
          (err, resp) => {}
        );
      } catch (error) {}
      res.json("site added!");
    })
    .catch(err => {
      res.status(500).send("adding site failed");
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
