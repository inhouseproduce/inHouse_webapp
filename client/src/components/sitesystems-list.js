import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import "../template.css";

// this displays the list of sitesystem present

const SitesystemsList = props => {
  let requestSitesystemDeleteCancelSources = [];
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
      } catch (error) {
        console.log(error);
      }
    };
    const requestSitesystemsListCancelSource = axios.CancelToken.source();
    requestSitesystemsList(requestSitesystemsListCancelSource);
    return () => {
      requestSitesystemsListCancelSource.cancel();
      requestSitesystemDeleteCancelSources.map(
        requestSitesystemDeleteCancelSource =>
          requestSitesystemDeleteCancelSource.cancel()
      );
    };
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
        requestSitesystemDeleteCancelSources.splice(
          requestSitesystemDeleteCancelSources.indexOf(axiosCancelSource),
          1
        );
        setSitesystems(
          sitesystems.filter(
            (sitesystem, index) =>
              index !==
              sitesystems.findIndex(
                sitesystem => sitesystem.sitesystem_hardwareid === id
              )
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    const requestSitesystemDeleteCancelSource = axios.CancelToken.source();
    requestSitesystemDeleteCancelSources.push(
      requestSitesystemDeleteCancelSource
    );
    requestSitesystemDelete(requestSitesystemDeleteCancelSource);
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
