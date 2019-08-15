import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

let _isMounted, site, setSite, history, siteid;

function handleSubmit(event) {
  event.preventDefault();
  const requestSiteCreate = async () => {
    try {
      await axios.post("/sites/update/" + siteid, {
        ...site,
        sites_updatedat: new Date()
      });
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

// this is to edit the sites present
function SiteEdit(props) {
  _isMounted = true;
  history = props.history;
  siteid = props.match.params.id;

  [site, setSite] = useState({
    sites_name: "",
    sites_location: ""
  });

  useEffect(() => {
    const requestSite = async () => {
      try {
        const response = await axios.get("/sites/" + siteid);
        if (_isMounted) {
          console.log(response.data);
          setSite(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    requestSite();
    return () => {
      _isMounted = false;
    };
  }, []);

  return (
    <div>
      <h3 align="center">Update Sites</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-white">Name: </label>
          <br />
          <input
            type="text"
            className="form-control"
            value={site.sites_name}
            onChange={handleChangeSitesName}
          />
        </div>
        <div className="form-group">
          <label className="text-white">Location: </label>
          <br />
          <input
            type="text"
            className="form-control"
            value={site.sites_location}
            onChange={handleChangeSitesLocation}
          />
        </div>

        <br />

        <div className="form-group">
          <input
            type="submit"
            value="Update Sites"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}

export default withRouter(SiteEdit);
