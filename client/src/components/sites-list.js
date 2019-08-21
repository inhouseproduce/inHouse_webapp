import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import "../template.css";

// this displays the list of sites present
const SitesList = props => {
  let axiosCancelSources = [];
  const { history } = props;

  const [sites, setSites] = useState([]);

  useEffect(() => {
    const requestSitesList = async axiosCancelSource => {
      try {
        const response = await axios.get("/sites/", {
          cancelToken: axiosCancelSource.token
        });
        console.log(response.data);
        setSites(response.data);
        axiosCancelSources.splice(
          axiosCancelSources.indexOf(axiosCancelSource),
          1
        );
      } catch (error) {
        console.log(error);
      }
    };
    axiosCancelSources.push(axios.CancelToken.source());
    requestSitesList(axiosCancelSources.slice(-1));
    return () =>
      axiosCancelSources.map(axiosCancelSource => axiosCancelSource.cancel());
  }, []);

  const handleEdit = (id, event) => {
    event.preventDefault();
    history.push(`/edit/${id}`);
  };

  const handleDelete = (id, event) => {
    event.preventDefault();
    const requestSiteDelete = async axiosCancelSource => {
      try {
        await axios.delete(`/sites/${id}`, {
          cancelToken: axiosCancelSource.token
        });
        setSites(
          sites.filter(
            (site, index) =>
              index !== sites.findIndex(site => site.sites_name === id)
          )
        );
        axiosCancelSources.splice(
          axiosCancelSources.indexOf(axiosCancelSource),
          1
        );
      } catch (error) {
        console.log(error);
      }
    };
    axiosCancelSources.push(axios.CancelToken.source());
    requestSiteDelete(axiosCancelSources.slice(-1));
  };

  const renderSitesList = () => {
    const Site = ({ site }) => (
      <div className="col-sm-4">
        <Link to={`/${site.sites_name}/sitesystems`} className="tile">
          <h5>
            {site.sites_name}
            <br />

            {site.sites_location}
          </h5>

          <Button
            variant="primary"
            onClick={event => handleEdit(site.sites_name, event)}
          >
            Edit
          </Button>
          <span> </span>
          <Button
            variant="danger"
            onClick={event => handleDelete(site.sites_name, event)}
          >
            Delete
          </Button>
        </Link>
      </div>
    );

    return sites.map((site, index) => {
      return <Site site={site} key={index} />;
    });
  };

  return (
    <div>
      <Button className="float-right" onClick={() => history.push("/create")}>
        <h4> Create Site</h4>
      </Button>

      <br />
      <h3>Sites List</h3>
      <br />
      <div className="row">{renderSitesList()}</div>
    </div>
  );
};

export default withRouter(SitesList);
