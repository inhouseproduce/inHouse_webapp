// this is for creating a module

import React, { useState } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

const ModuleCreate = props => {
  const { history } = props;
  const siteid = props.match.params.siteid;
  const sitesystemid = props.match.params.sitesystemid;
  const stackid = props.match.params.stackid;

  const [module, setModule] = useState({
    module_cropname: "",
    module_cameranum: "",
    module_stackid: `${sitesystemid}_${stackid}`
  });

  const handleSubmit = event => {
    event.preventDefault();
    const requestModuleCreate = async () => {
      try {
        await axios.post(
          `/sites/${siteid}/sitesystems/${sitesystemid}/stacks/${stackid}/modules/add`,
          {
            ...module,
            module_createdat: new Date()
          }
        );
        history.push(
          `/${siteid}/sitesystems/${sitesystemid}/stacks/${stackid}/modules`
        );
      } catch (error) {
        console.log(error);
      }
    };
    requestModuleCreate();
  };

  const handleChangeModuleCropname = event =>
    setModule({ ...module, module_cropname: event.target.value });

  const handleChangeModuleCameranum = event =>
    setModule({ ...module, module_cameranum: event.target.value });

  return (
    <div style={{ marginTop: 10 }}>
      <h3>Create New Module</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-white">Crop Name: </label>
          <input
            type="text"
            className="form-control input-text"
            value={module.module_cropname}
            onChange={handleChangeModuleCropname}
          />
        </div>

        <div className="form-group">
          <label className="text-white">Camera Num: </label>
          <input
            type="text"
            className="form-control input-text"
            value={module.module_cameranum}
            onChange={handleChangeModuleCameranum}
          />
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Create Module"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default withRouter(ModuleCreate);
