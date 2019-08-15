import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

// this is to edit the sites present
const SiteEdit = props => {
  const _isMounted = useRef(true);
  const { history } = props;
  const siteid = props.match.params.id;

  const [site, setSite] = useState({
    sites_name: "",
    sites_location: ""
  });

  useEffect(() => {
    const requestSite = async () => {
      try {
        const response = await axios.get(`/sites/${siteid}`);
        if (_isMounted.current) {
          console.log(response.data);
          setSite(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    requestSite();
    return () => (_isMounted.current = false);
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    const requestSiteUpdate = async () => {
      try {
        await axios.post(`/sites/update/${siteid}`, {
          ...site,
          sites_updatedat: new Date()
        });
        history.push("/");
      } catch (error) {
        console.log(error);
      }
    };
    requestSiteUpdate();
  };

  const handleChangeSitesName = event =>
    setSite({ ...site, sites_name: event.target.value });

  const handleChangeSitesLocation = event =>
    setSite({ ...site, sites_location: event.target.value });

  return (
    <div>
      <h3 align="center">Update Site</h3>
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
            value="Update Site"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default withRouter(SiteEdit);
