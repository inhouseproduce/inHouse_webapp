import React, { useState } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

// this is called when you click on Create Sitesystem button

const SitesystemCreate = props => {
  const { history } = props;
  const siteid = props.match.params.siteid;

  const [sitesystem, setSitesystem] = useState({
    sitesystem_name: "",
    sitesystem_hardwareid: "",
    sitesystem_siteid: siteid,
    sitesystem_updatedat: ""
  });

  const handleSubmit = event => {
    event.preventDefault();
    const requestSitesystemCreate = async () => {
      try {
        await axios.post(`/sites/${siteid}/sitesystems/add`, {
          ...sitesystem,
          sitesystem_createdat: new Date()
        });
        history.push(`/${siteid}/sitesystems`);
      } catch (error) {
        console.log(error);
      }
    };
    requestSitesystemCreate();
  };

  const handleChangeSitesystemName = event =>
    setSitesystem({ ...sitesystem, sitesystem_name: event.target.value });

  const handleChangeSitesystemHardwareid = event =>
    setSitesystem({ ...sitesystem, sitesystem_hardwareid: event.target.value });

  return (
    <div style={{ marginTop: 10 }}>
      <h3>Create New Sitesystem</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-white">Sitesystem Name: </label>
          <input
            type="text"
            className="form-control input-text"
            value={sitesystem.sitesystem_name}
            onChange={handleChangeSitesystemName}
          />
        </div>
        <div className="form-group">
          <label className="text-white">Hardware Id: </label>
          <input
            type="text"
            className="form-control input-text"
            value={sitesystem.sitesystem_hardwareid}
            onChange={handleChangeSitesystemHardwareid}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Create Site System"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default withRouter(SitesystemCreate);
