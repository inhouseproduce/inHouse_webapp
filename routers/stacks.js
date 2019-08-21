const express = require("express");
const stacksRouter = express.Router();
const modulesRouter = require("./modules");

let { Stacks } = require("../sites.model");

// get stacks by sitesystem hardware id
stacksRouter.route("/").get((req, res) => {
  let id = req.sitesystemid;
  Stacks.find({ stack_sitesystemid: id }, (err, stacks) => {
    if (err) {
      res.status(500).send("getting stacks failed");
    } else {
      res.json(stacks);
    }
  });
});

// add stack
stacksRouter.route("/add").post((req, res) => {
  Stacks.find({ stack_sitesystemid: req.sitesystemid }, (err, stacks) => {
    if (err) {
      res.status(500).send("adding stack failed");
    } else {
      let stack = new Stacks({
        ...req.body,
        stack_name: `Stack${stacks.length + 1}`
      });
      stack
        .save()
        .then(stack => {
          try {
            req.s3.putObject(
              {
                Bucket: req.S3Bucket,
                Key: `${req.siteid}/${req.sitesystemid}/${stack.stack_name}/`
              },
              (err, resp) => {}
            );
          } catch (error) {}
          res.json("stack added!");
        })
        .catch(err => {
          res.status(500).send("adding stack failed");
        });
    }
  });
});

stacksRouter.use(
  "/:id/modules",
  (req, res, next) => {
    req.stackid = req.params.id;
    next();
  },
  modulesRouter
);

module.exports = stacksRouter;
