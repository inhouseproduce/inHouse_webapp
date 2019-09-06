// this is a router for all module related routes

const express = require("express");
const modulesRouter = express.Router();

let { Modules } = require("../sites.model");

// get modules by stack name
modulesRouter.route("/").get((req, res) => {
  let id = `${req.sitesystemid}_${req.stackid}`;
  Modules.find({ module_stackid: id }, (err, modules) => {
    if (err) {
      res.status(500).send("getting modules failed");
    } else {
      let count = 0;
      if (modules.length === 0) {
        res.json(modules);
      } else {
        for (let module of modules) {
          // fetching last modified image for each module from s3
          try {
            req.s3.listObjectsV2(
              {
                Bucket: req.S3Bucket,
                Prefix: `${req.siteid}/${req.sitesystemid}/${req.stackid}/${
                  module.module_name
                }/`,
                Delimiter: "/"
              },
              (err, resp) => {
                const module_name = resp.Prefix.split("/").slice(-2, -1)[0];
                let Module = modules.find(
                  element => element.module_name === module_name
                );
                // find function was used above because this callback function can be called out of order
                if (err || (resp.Contents && resp.Contents.length <= 1)) {
                  Module.module_imageurl = "";
                } else {
                  const latest = resp.Contents.filter(
                    element => element.Size !== 0
                  ).reduce((prev, current) => {
                    return prev.LastModified > current.LastModified
                      ? prev
                      : current;
                  });
                  Module.module_imageurl = `/sites/${req.siteid}/sitesystems/${
                    req.sitesystemid
                  }/stacks/${req.stackid}/modules/${
                    Module.module_name
                  }/images/${latest.Key.split("/").pop()}`;
                }
                count++;
                if (count === modules.length) {
                  // this condition is true when all the asynchronous listObjectsV2 jobs have finished
                  res.json(modules);
                }
              }
            );
          } catch (error) {
            module.module_imageurl = "";
          }
        }
      }
    }
  });
});

// get module by module name
modulesRouter.route("/:id").get((req, res) => {
  let id = req.params.id;
  let mod_stackid = `${req.sitesystemid}_${req.stackid}`;
  Modules.find(
    { module_name: id, module_stackid: mod_stackid },
    (err, modules) => {
      if (err) {
        res.status(500).send("getting module failed");
      } else if (modules.length === 0) {
        res.status(404).send("module not found");
      } else {
        res.json(modules[0]);
      }
    }
  );
});

// get module image by image name
modulesRouter.route("/:id/images/:name").get((req, res) => {
  const key = `${req.siteid}/${req.sitesystemid}/${req.stackid}/${
    req.params.id
  }/${req.params.name}`;
  try {
    req.s3.getObject({ Bucket: req.S3Bucket, Key: key }, (err, resp) => {
      if (err) {
        if (err.statusCode === 404) {
          res.status(404).send("image not Found");
        } else {
          res.status(500).send("getting image failed");
        }
      } else {
        res.set("Content-Type", resp.ContentType);
        res.send(resp.Body);
      }
    });
  } catch (error) {
    res.status(500).send("getting image failed");
  }
});

// update module
modulesRouter.route("/update/:id").post((req, res) => {
  let mod_stackid = `${req.sitesystemid}_${req.stackid}`;
  Modules.find(
    { module_name: req.params.id, module_stackid: mod_stackid },
    (err, modules) => {
      if (err) {
        res.status(500).send("updating module failed");
      } else if (modules.length === 0) {
        res.status(404).send("module not found");
      } else {
        modules[0].module_cropname = req.body.module_cropname;
        modules[0].module_cameranum = req.body.module_cameranum;
        modules[0].module_updatedat = req.body.module_updatedat;
        modules[0]
          .save()
          .then(modules => {
            res.json("module updated!");
          })
          .catch(err => {
            res.status(500).send("updating module failed");
          });
      }
    }
  );
});

// add module
modulesRouter.route("/add").post((req, res) => {
  Modules.find({ module_stackid: req.body.module_stackid }, (err, modules) => {
    if (err) {
      res.status(500).send("adding module failed");
    } else {
      let module = new Modules({
        ...req.body,
        module_name: `Module${modules.length + 1}`
      });
      module
        .save()
        .then(module => {
          try {
            req.s3.putObject(
              {
                Bucket: req.S3Bucket,
                Key: `${req.siteid}/${req.sitesystemid}/${req.stackid}/${
                  module.module_name
                }/`
              },
              (err, resp) => {}
            );
          } catch (error) {}
          res.json("module added!");
        })
        .catch(err => {
          res.status(500).send("adding module failed");
        });
    }
  });
});

module.exports = modulesRouter;
