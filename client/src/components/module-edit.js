import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

// this is called when Edit Module Button is clicked

const ModuleEdit = props => {
  let axiosCancelSources = [];
  const { history } = props;
  const siteid = props.match.params.siteid;
  const sitesystemid = props.match.params.sitesystemid;
  const stackid = props.match.params.stackid;
  const moduleid = props.match.params.id;

  const [module, setModule] = useState({
    module_cropname: "",
    module_cameranum: ""
  });

  useEffect(() => {
    const requestModule = async axiosCancelSource => {
      try {
        const response = await axios.get(
          `/sites/${siteid}/sitesystems/${sitesystemid}/stacks/${stackid}/modules/${moduleid}`,
          {
            cancelToken: axiosCancelSource.token
          }
        );
        console.log(response.data);
        setModule(response.data);
        axiosCancelSources.splice(
          axiosCancelSources.indexOf(axiosCancelSource),
          1
        );
      } catch (error) {
        console.log(error);
      }
    };
    axiosCancelSources.push(axios.CancelToken.source());
    requestModule(axiosCancelSources.slice(-1));
    return () =>
      axiosCancelSources.map(axiosCancelSource => axiosCancelSource.cancel());
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    const requestModuleUpdate = async () => {
      try {
        await axios.post(
          `/sites/${siteid}/sitesystems/${sitesystemid}/stacks/${stackid}/modules/update/${moduleid}`,
          {
            ...module,
            module_updatedat: new Date()
          }
        );
        history.push(
          `/${siteid}/sitesystems/${sitesystemid}/stacks/${stackid}/modules`
        );
      } catch (error) {
        console.log(error);
      }
    };
    requestModuleUpdate();
  };

  const handleChangeModuleCropname = event =>
    setModule({ ...module, module_cropname: event.target.value });

  const handleChangeModuleCameranum = event =>
    setModule({ ...module, module_cameranum: event.target.value });

  return (
    <div>
      <h3 align="center">Update Module</h3>
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
            value="Update Module"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default withRouter(ModuleEdit);
