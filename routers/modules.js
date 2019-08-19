const express = require("express");
const modulesRouter = express.Router();

let { Modules } = require("../sites.model");

// get modules by stack name
modulesRouter.route("/").get((req, res) => {
  let id = `${req.sitesystemid}_${req.stackid}`;
  console.log(id);
  Modules.find({ module_stackid: id }, (err, modules) => {
    if (!modules || modules.length === 0)
      res.status(404).send("data is not found");
    else {
      const prefix = `${req.siteid}/${req.sitesystemid}/${req.stackid}`;
      let count = 0;
      for (site of modules) {
        try {
          req.s3.listObjectsV2(
            {
              Bucket: req.S3Bucket,
              Prefix: `${prefix}/${site.module_name}/`,
              Delimiter: "/"
            },
            (err, resp) => {
              const module_name = resp.Prefix.split("/").slice(-2, -1)[0];
              let Site = modules.find(
                element => element.module_name === module_name
              );
              if (err || (resp.Contents && resp.Contents.length <= 1)) {
                Site.module_imageurl = "";
              } else {
                const latest = resp.Contents.filter(
                  element => element.Size !== 0
                ).reduce((prev, current) => {
                  return prev.LastModified > current.LastModified
                    ? prev
                    : current;
                });
                Site.module_imageurl = `/sites/${req.siteid}/sitesystems/${
                  req.sitesystemid
                }/stacks/${req.stackid}/modules/${
                  Site.module_name
                }/images/${latest.Key.split("/").pop()}`;
              }
              count++;
              if (count === modules.length) {
                res.json(modules);
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

// get module by module name
modulesRouter.route("/:id").get((req, res) => {
  let id = req.params.id;
  //console.log(id);
  let mod_stackid = `${req.sitesystemid}_${req.stackid}`;
  //console.log(mod_stackid);
  Modules.find(
    { module_name: id, module_stackid: mod_stackid },
    (err, modules) => {
      if (!modules || modules.length === 0)
        res.status(404).send("data is not found");
      else {
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

// update module
modulesRouter.route("/update/:id").post((req, res) => {
  let mod_stackid = `${req.sitesystemid}_${req.stackid}`;
  Modules.find(
    { module_name: req.params.id, module_stackid: mod_stackid },
    (err, modules) => {
      if (!modules || modules.length === 0)
        res.status(404).send("data is not found");
      else {
        modules[0].module_cropname = req.body.module_cropname;
        modules[0].module_cameranum = req.body.module_cameranum;
        modules[0].module_updatedat = req.body.module_updatedat;
      }

      modules[0]
        .save()
        .then(modules => {
          res.json("Module updated!");
        })
        .catch(err => {
          res.status(400).send("Update not possible");
        });
    }
  );
});

// add module
modulesRouter.route("/add").post((req, res) => {
  let modules = {};
  modules.module_cropname = req.body.module_cropname;
  modules.module_createdat = req.body.module_createdat;
  modules.module_imageurl = req.body.module_imageurl;
  modules.module_cameranum = req.body.module_cameranum;
  modules.module_stackid = req.body.module_stackid;
  console.log(req.body.module_stackid);

  Modules.find({ module_stackid: req.body.module_stackid }, (err, mod) => {
    console.log(mod);
    if (!mod || mod.length == 0) modules.module_name = "Module1";
    else {
      let len = mod.length + 1;
      modules.module_name = `Module${len}`;
    }

    let module = new Modules(modules);
    console.log(module);
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
            resp => {
              console.log(arguments);
              console.log("Successfully uploaded module.");
            }
          );
        } catch (error) {
          console.log(error);
        }
        res.status(200).json({ modules: "module added successfully" });
      })
      .catch(err => {
        console.log(err);
        res.status(400).send("adding new module failed");
      });
  });
});

module.exports = modulesRouter;
