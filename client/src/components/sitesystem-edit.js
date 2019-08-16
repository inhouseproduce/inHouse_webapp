import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import TimersList from "./timers-list";

// this is called when you click on Edit Sitesystem Button

const SitesystemEdit = props => {
  const _isMounted = useRef(true);
  const { history } = props;
  const siteid = props.match.params.siteid;
  const sitesystemid = props.match.params.id;

  const [sitesystem, setSitesystem] = useState({
    sitesystem_name: "",
    sitesystem_hardwareid: "",
    sitesystem_timers: []
  });
  const [maxkey, setMaxkey] = useState(0);

  const handleAdd = () => setMaxkey(maxkey + 1);

  useEffect(() => {
    const requestSitesystem = async () => {
      try {
        const response = await axios.get(
          `/sites/${siteid}/sitesystems/${sitesystemid}`
        );
        if (_isMounted.current) {
          console.log(response.data);
          setMaxkey(response.data.sitesystem_timers.length);
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
    requestSitesystem();
    return () => (_isMounted.current = false);
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    const requestSitesystemUpdate = async () => {
      try {
        await axios.post(
          `/sites/${siteid}/sitesystems/update/${sitesystemid}`,
          {
            ...sitesystem,
            sitesystem_timers: sitesystem.sitesystem_timers.map(
              sitesystem_timer => {
                delete sitesystem_timer.key;
                return sitesystem_timer;
              }
            ),
            sitesystem_updatedat: new Date()
          }
        );
        history.push(`/${siteid}/sitesystems`);
      } catch (error) {
        console.log(error);
      }
    };
    requestSitesystemUpdate();
  };

  const handleChangeSitesystemName = event =>
    setSitesystem({ ...sitesystem, sitesystem_name: event.target.value });

  const handleChangeSitesystemHardwareid = event =>
    setSitesystem({ ...sitesystem, sitesystem_hardwareid: event.target.value });

  return (
    <div>
      <h3 align="center">Update Sitesystem</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-white">Sitesystem Name: </label>
          <input
            type="text"
            className="form-control input-text"
            value={sitesystem.sitesystem_name}
            onChange={handleChangeSitesystemName}
          />
        </div>
        <div className="form-group">
          <label className="text-white">Hardware Id: </label>
          <input
            type="text"
            className="form-control input-text"
            value={sitesystem.sitesystem_hardwareid}
            onChange={handleChangeSitesystemHardwareid}
          />
        </div>
        <div className="form-group">
          <label className="text-white">Timers: </label>
          <TimersList
            sitesystem={sitesystem}
            setSitesystem={setSitesystem}
            maxkey={maxkey}
            handleAdd={handleAdd}
            editable={true}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Update Sitesystem"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default withRouter(SitesystemEdit);
