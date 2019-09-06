// this is for listing all modules

import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";
import "../template.css";

const ModulesList = props => {
  let axiosCancelSources = [];
  const { history } = props;
  const siteid = props.match.params.siteid;
  const sitesystemid = props.match.params.sitesystemid;
  const stackid = props.match.params.stackid;

  const [modules, setModules] = useState([]);

  useEffect(() => {
    const requestModulesList = async axiosCancelSource => {
      try {
        const response = await axios.get(
          `/sites/${siteid}/sitesystems/${sitesystemid}/stacks/${stackid}/modules`,
          {
            cancelToken: axiosCancelSource.token
          }
        );
        console.log(response.data);
        setModules(response.data);
        axiosCancelSources.splice(
          axiosCancelSources.indexOf(axiosCancelSource),
          1
        );
      } catch (error) {
        console.log(error);
      }
    };
    axiosCancelSources.push(axios.CancelToken.source());
    requestModulesList(axiosCancelSources.slice(-1));
    return () =>
      axiosCancelSources.map(axiosCancelSource => axiosCancelSource.cancel());
  }, []);

  const handleEdit = (id, event) => {
    event.preventDefault();
    history.push(
      `/${siteid}/sitesystems/${sitesystemid}/stacks/${stackid}/modules/edit/${id}`
    );
  };

  const renderModulesList = () => {
    const Module = ({ module }) => (
      <div className="col-sm-4">
        <div className="tile">
          {module.module_imageurl === "" ? (
            <></>
          ) : (
            <a href={module.module_imageurl} target="_blank">
              <img src={module.module_imageurl} />
            </a>
          )}
          <h5>{module.module_name}</h5>
          <h5>{module.module_cropname}</h5>
          <h5>{module.module_cameranum}</h5>
          <Button
            variant="primary"
            onClick={event => handleEdit(module.module_name, event)}
          >
            Edit
          </Button>
        </div>
      </div>
    );

    return modules.map((module, index) => {
      return <Module module={module} key={index} />;
    });
  };

  return (
    <div>
      <Button
        className="float-right"
        onClick={() =>
          history.push(
            `/${siteid}/sitesystems/${sitesystemid}/stacks/${stackid}/modules/create`
          )
        }
      >
        <h4> Create Module</h4>
      </Button>
      <br />
      <h3>Modules List</h3>
      <div className="row">{renderModulesList()}</div>
    </div>
  );
};

export default withRouter(ModulesList);
