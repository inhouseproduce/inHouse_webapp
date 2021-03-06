// this is for editing a site

import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

const SiteEdit = props => {
  let axiosCancelSources = [];
  const { history } = props;
  const siteid = props.match.params.id;

  const [site, setSite] = useState({
    sites_name: "",
    sites_location: ""
  });

  useEffect(() => {
    const requestSite = async axiosCancelSource => {
      try {
        const response = await axios.get(`/sites/${siteid}`, {
          cancelToken: axiosCancelSource.token
        });
        console.log(response.data);
        setSite(response.data);
        axiosCancelSources.splice(
          axiosCancelSources.indexOf(axiosCancelSource),
          1
        );
      } catch (error) {
        console.log(error);
      }
    };
    axiosCancelSources.push(axios.CancelToken.source());
    requestSite(axiosCancelSources.slice(-1));
    return () =>
      axiosCancelSources.map(axiosCancelSource => axiosCancelSource.cancel());
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
