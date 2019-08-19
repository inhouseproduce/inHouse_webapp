const express = require("express");
const sitesystemsRouter = express.Router();
const stacksRouter = require("./stacks");

let { Sitesystems } = require("../sites.model");

// get sitesystems by site name
sitesystemsRouter.route("/").get((req, res) => {
  let id = req.siteid;
  Sitesystems.find({ sitesystem_siteid: id }, (err, sitesystems) => {
    if (!sitesystems || sitesystems.length === 0)
      res.status(404).send("data is not found");
    else {
      res.json(sitesystems);
    }
  });
});

// get sitesystem by hardware id
sitesystemsRouter.route("/:id").get((req, res) => {
  let id = req.params.id;
  Sitesystems.find({ sitesystem_hardwareid: id }, (err, sitesystems) => {
    if (!sitesystems || sitesystems.length === 0)
      res.status(404).send("data is not found");
    else {
      console.log(sitesystems[0]);
      res.json(sitesystems[0]);
    }
  });
});

// update sitesystem
sitesystemsRouter.route("/update/:id").post((req, res) => {
  Sitesystems.find(
    { sitesystem_hardwareid: req.params.id },
    (err, sitesystems) => {
      if (!sitesystems || sitesystems.length === 0)
        res.status(404).send("data is not found");
      else {
        //console.log(req.body.sitesystem_timers);
        sitesystems[0].sitesystem_updatedat = req.body.sitesystem_updatedat;
        sitesystems[0].sitesystem_hardwareid = req.body.sitesystem_hardwareid;
        sitesystems[0].sitesystem_name = req.body.sitesystem_name;
        sitesystems[0].sitesystem_temp = req.body.sitesystem_temp;
        sitesystems[0].sitesystem_humidity = req.body.sitesystem_humidity;
        sitesystems[0].sitesystem_timers = req.body.sitesystem_timers;
      }

      sitesystems[0]
        .save()
        .then(sitesystems => {
          console.log(sitesystems);
          res.json("Sitesystem updated!");
        })
        .catch(err => {
          res.status(400).send("Update not possible");
        });
    }
  );
});

// delete sitesystem
sitesystemsRouter.route("/:id").delete((req, res) => {
  let id = req.params.id;
  Sitesystems.findOneAndDelete({ sitesystem_hardwareid: id }, err => {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

sitesystemsRouter.route("/add").post((req, res) => {
  let sitesystems = new Sitesystems({ ...req.body, sitesystem_timers: [] });
  sitesystems
    .save()
    .then(sitesystems => {
      try {
        req.s3.putObject(
          {
            Bucket: req.S3Bucket,
            Key: `${req.siteid}/${sitesystems.sitesystem_name}_${
              sitesystems.sitesystem_hardwareid
            }/`
          },
          resp => {
            console.log(arguments);
            console.log("Successfully uploaded sitesystem.");
          }
        );
      } catch (error) {
        console.log(errir);
      }

      res.status(200).json({ sitesystems: "sitesystem added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new sitesystem failed");
    });
});

sitesystemsRouter.use(
  "/:id/stacks",
  (req, res, next) => {
    req.sitesystemid = req.params.id;
    next();
  },
  stacksRouter
);

module.exports = sitesystemsRouter;
