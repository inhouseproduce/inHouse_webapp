import React, { useState } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

let site, setSite, history;

function handleSubmit(event) {
  event.preventDefault();
  const requestSiteCreate = async () => {
    try {
      await axios.post("/sites/add", { ...site, sites_createdat: new Date() });
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  requestSiteCreate();
}

function handleChangeSitesName(event) {
  setSite({ ...site, sites_name: event.target.value });
}

function handleChangeSitesLocation(event) {
  setSite({ ...site, sites_location: event.target.value });
}

// this is to create a new site when you click on Create Site Button
function SiteCreate(props) {
  history = props.history;

  [site, setSite] = useState({
    sites_name: "",
    sites_location: "",
    sites_updatedat: ""
  });

  return (
    <div style={{ marginTop: 10 }}>
      <h3>Create New Site</h3>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-white">Name:</label>
          <br />
          <input
            type="text"
            className="form-control input-text"
            value={site.sites_name}
            onChange={handleChangeSitesName}
          />
        </div>
        <div className="form-group">
          <label className="text-white">Location: </label>
          <br />
          <input
            type="text"
            className="form-control input-text"
            value={site.sites_location}
            onChange={handleChangeSitesLocation}
          />
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Create Sites"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}

export default withRouter(SiteCreate);
