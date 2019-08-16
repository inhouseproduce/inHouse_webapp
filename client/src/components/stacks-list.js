import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import TimersList from "./timers-list";
import "../template.css";

// this displays the list of stacks present

const StacksList = props => {
  const _isMounted = useRef(true);
  const siteid = props.match.params.siteid;
  const sitesystemid = props.match.params.sitesystemid;

  const [stacks, setStacks] = useState([]);
  const [sitesystem, setSitesystem] = useState({
    sitesystem_name: "",
    sitesystem_hardwareid: "",
    sitesystem_timers: []
  });

  const requestStacksList = async () => {
    try {
      const response = await axios.get(
        `/sites/${siteid}/sitesystems/${sitesystemid}/stacks`
      );
      if (_isMounted.current) {
        console.log(response.data);
        setStacks(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const requestSitesystem = async () => {
      try {
        const response = await axios.get(
          `/sites/${siteid}/sitesystems/${sitesystemid.split("_").pop()}`
        );
        if (_isMounted.current) {
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
        }
      } catch (error) {
        console.log(error);
      }
    };
    requestStacksList();
    requestSitesystem();
    return () => (_isMounted.current = false);
  }, []);

  const handleCreate = event => {
    event.preventDefault();
    const requestSitesystemCreate = async () => {
      try {
        await axios.post(
          `/sites/${siteid}/sitesystems/${sitesystemid}/stacks/add`,
          {
            stack_sitesystemid: sitesystemid,
            stack_createdat: new Date()
          }
        );
        requestStacksList();
      } catch (error) {
        console.log(error);
      }
    };
    requestSitesystemCreate();
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
