const express = require("express");
const stacksRouter = express.Router();
const modulesRouter = require("./modules");

let { Stacks } = require("../sites.model");

// get stacks by sitesystem hardware id
stacksRouter.route("/").get((req, res) => {
  let id = req.sitesystemid;
  Stacks.find({ stack_sitesystemid: id }, (err, stacks) => {
    if (!stacks || stacks.length === 0)
      res.status(404).send("data is not found");
    else {
      res.json(stacks);
    }
  });
});

// add stack
stacksRouter.route("/add").post((req, res) => {
  let stacks = {};
  stacks.stack_sitesystemid = req.body.stack_sitesystemid;
  stacks.stack_createdat = req.body.stack_createdat;

  Stacks.find({ stack_sitesystemid: req.sitesystemid }, (err, stacks) => {
    console.log(stacks.length);
    if (!stacks || stacks.length == 0) stacks.stack_name = "Stack1";
    else {
      let len = stacks.length + 1;
      stacks.stack_name = `Stack${len}`;
    }

    let stack = new Stacks(stacks);
    console.log(stack);
    stack
      .save()
      .then(stack => {
        try {
          req.s3.putObject(
            {
              Bucket: req.S3Bucket,
              Key: `${req.siteid}/${req.sitesystemid}/${stacks.stack_name}/`
            },
            resp => {
              console.log(arguments);
              console.log("Successfully uploaded stack.");
            }
          );
        } catch (error) {
          console.log(error);
        }
        res.status(200).json({ stacks: "stack added successfully" });
      })
      .catch(err => {
        res.status(400).send("adding new stack failed");
      });
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
