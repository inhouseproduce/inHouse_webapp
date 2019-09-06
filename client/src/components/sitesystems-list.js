// this is for listing all sitesystems

import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import "../template.css";

const SitesystemsList = props => {
  let axiosCancelSources = [];
  const { history } = props;
  const siteid = props.match.params.siteid;

  const [sitesystems, setSitesystems] = useState([]);

  useEffect(() => {
    const requestSitesystemsList = async axiosCancelSource => {
      try {
        const response = await axios.get(`/sites/${siteid}/sitesystems`, {
          cancelToken: axiosCancelSource.token
        });
        console.log(response.data);
        setSitesystems(response.data);
        axiosCancelSources.splice(
          axiosCancelSources.indexOf(axiosCancelSource),
          1
        );
      } catch (error) {
        console.log(error);
      }
    };
    axiosCancelSources.push(axios.CancelToken.source());
    requestSitesystemsList(axiosCancelSources.slice(-1));
    return () =>
      axiosCancelSources.map(axiosCancelSource => axiosCancelSource.cancel());
  }, []);

  const handleEdit = (id, event) => {
    event.preventDefault();
    history.push(`/${siteid}/sitesystems/edit/${id}`);
  };

  const handleDelete = (id, event) => {
    event.preventDefault();
    const requestSitesystemDelete = async axiosCancelSource => {
      try {
        await axios.delete(`/sites/${siteid}/sitesystems/${id}`, {
          cancelToken: axiosCancelSource.token
        });
        setSitesystems(
          sitesystems.filter(
            (sitesystem, index) =>
              index !==
              sitesystems.findIndex(
                sitesystem => sitesystem.sitesystem_hardwareid === id
              )
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
    requestSitesystemDelete(axiosCancelSources.slice(-1));
  };

  const renderSitesystemsList = () => {
    const Sitesystem = ({ sitesystem }) => (
      <div className="col-sm-4">
        <Link
          to={`/${siteid}/sitesystems/${sitesystem.sitesystem_name}_${
            sitesystem.sitesystem_hardwareid
          }/stacks`}
          className="tile"
        >
          <h5>
            {sitesystem.sitesystem_name}
            <br />
            {sitesystem.sitesystem_hardwareid}
          </h5>
          <Button
            variant="primary"
            onClick={event =>
              handleEdit(sitesystem.sitesystem_hardwareid, event)
            }
          >
            Edit
          </Button>
          <span> </span>
          <Button
            variant="danger"
            onClick={event =>
              handleDelete(sitesystem.sitesystem_hardwareid, event)
            }
          >
            Delete
          </Button>
        </Link>
      </div>
    );

    return sitesystems.map((sitesystem, index) => {
      return <Sitesystem sitesystem={sitesystem} key={index} />;
    });
  };

  return (
    <div>
      <Button
        className="float-right"
        onClick={() => history.push(`/${siteid}/sitesystems/create`)}
      >
        <h4> Create Sitesystem</h4>
      </Button>
      <br />
      <h3>Sitesystems List</h3>
      <div className="row">{renderSitesystemsList()}</div>
    </div>
  );
};

export default withRouter(SitesystemsList);
