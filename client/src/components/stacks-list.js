import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import TimersList from "./timers-list";
import "../template.css";

// this displays the list of stacks present

const StacksList = props => {
  let requestStackCreateCancelSources = [];
  const siteid = props.match.params.siteid;
  const sitesystemid = props.match.params.sitesystemid;

  const [stacks, setStacks] = useState([]);
  const [sitesystem, setSitesystem] = useState({
    sitesystem_name: "",
    sitesystem_hardwareid: "",
    sitesystem_timers: []
  });

  useEffect(() => {
    const requestStacksList = async axiosCancelSource => {
      try {
        const response = await axios.get(
          `/sites/${siteid}/sitesystems/${sitesystemid}/stacks`,
          {
            cancelToken: axiosCancelSource.token
          }
        );
        console.log(response.data);
        setStacks(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const requestSitesystem = async axiosCancelSource => {
      try {
        const response = await axios.get(
          `/sites/${siteid}/sitesystems/${sitesystemid.split("_").pop()}`,
          {
            cancelToken: axiosCancelSource.token
          }
        );
        console.log(response.data.sitesystem_timers);
        setSitesystem({
          ...response.data,
          sitesystem_timers: response.data.sitesystem_timers.map(
            (sitesystem_timer, index) => {
              sitesystem_timer.key = index;
              return sitesystem_timer;
            }
          )
        });
      } catch (error) {
        console.log(error);
      }
    };
    const requestStacksListCancelSource = axios.CancelToken.source();
    requestStacksList(requestStacksListCancelSource);
    const requestSitesystemCancelSource = axios.CancelToken.source();
    requestSitesystem(requestSitesystemCancelSource);
    return () => {
      requestStacksListCancelSource.cancel();
      requestSitesystemCancelSource.cancel();
      requestStackCreateCancelSources.map(requestStackCreateCancelSource =>
        requestStackCreateCancelSource.cancel()
      );
    };
  }, []);

  const handleCreate = event => {
    event.preventDefault();
    const requestStackCreate = async axiosCancelSource => {
      try {
        const body = {
          stack_sitesystemid: sitesystemid,
          stack_createdat: new Date()
        };
        await axios.post(
          `/sites/${siteid}/sitesystems/${sitesystemid}/stacks/add`,
          body,
          {
            cancelToken: axiosCancelSource.token
          }
        );
        requestStackCreateCancelSources.splice(
          requestStackCreateCancelSources.indexOf(axiosCancelSource),
          1
        );
        setStacks(
          stacks.concat([
            {
              ...body,
              stack_name: `Stack${stacks.length + 1}`
            }
          ])
        );
      } catch (error) {
        console.log(error);
      }
    };
    const requestStackCreateCancelSource = axios.CancelToken.source();
    requestStackCreateCancelSources.push(requestStackCreateCancelSource);
    requestStackCreate(requestStackCreateCancelSource);
  };

  const renderStacksList = () => {
    const Stack = ({ stack }) => (
      <div className="col-sm-4">
        <Link
          to={`/${siteid}/sitesystems/${sitesystemid}/stacks/${
            stack.stack_name
          }/modules`}
          className="tile"
        >
          <h5>{stack.stack_name}</h5>
        </Link>
      </div>
    );

    return stacks.map((stack, index) => {
      return <Stack stack={stack} key={index} />;
    });
  };

  return (
    <div>
      <Button className="float-right" onClick={event => handleCreate(event)}>
        <h4>Create Stack</h4>
      </Button>
      <br />
      <h3>Timers List</h3>
      <TimersList
        sitesystem={sitesystem}
        setSitesystem={setSitesystem}
        maxkey={0}
        handleAdd={() => {}}
        editable={false}
      />
      <br />
      <h3>Stacks List</h3>
      <div className="row">{renderStacksList()}</div>
    </div>
  );
};

export default withRouter(StacksList);
