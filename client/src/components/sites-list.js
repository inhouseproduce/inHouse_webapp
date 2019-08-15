import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import "../template.css";

let _isMounted, sites, setSites, history;

function handleEdit(id, event) {
  event.preventDefault();
  history.push("/edit/" + id);
}

function handleDelete(id, event) {
  event.preventDefault();
  const requestSiteDelete = async () => {
    try {
      await axios.delete("/sites/" + id);
      const index = sites.findIndex(site => site.sites_name === id);
      if (index !== -1 && _isMounted) {
        setSites(sites.filter((site, idx) => idx !== index));
      }
    } catch (error) {
      console.log(error);
    }
  };
  requestSiteDelete();
}

function renderSitesList() {
  const Sites = ({ site }) => (
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

  return sites.map(function(site, i) {
    return <Sites site={site} key={i} />;
  });
}

// this displays the list of sites present
function SitesList(props) {
  _isMounted = true;
  history = props.history;

  [sites, setSites] = useState([]);

  useEffect(() => {
    const requestSitesList = async () => {
      try {
        const response = await axios.get("/sites/");
        if (_isMounted) {
          console.log(response.data);
          setSites(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    requestSitesList();
    return () => {
      _isMounted = false;
    };
  }, []);

  return (
    <div>
      <Button className="float-right" onClick={() => history.push("/create")}>
        <h4> Create Sites</h4>
      </Button>

      <br />
      <h3>Sites List</h3>
      <br />
      <div className="row">{renderSitesList()}</div>
    </div>
  );
}

export default withRouter(SitesList);
