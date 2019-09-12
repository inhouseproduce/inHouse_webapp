// this is for editing a sitesystem

import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import TimersList from "./timers-list";
import SitesystemContext from "../contexts/sitesystem";


const SitesystemEdit = props => {
  let axiosCancelSources = [];
  let timersMaxkey = 0;
  const { history } = props;
  const siteid = props.match.params.siteid;
  const sitesystemid = props.match.params.id;

  const [sitesystem, setSitesystem] = useState({
    sitesystem_name: "",
    sitesystem_hardwareid: "",
    sitesystem_timers: []
  });

  useEffect(() => {
    const requestSitesystem = async axiosCancelSource => {
      try {
        const response = await axios.get(
          `/sites/${siteid}/sitesystems/${sitesystemid}`,
          {
            cancelToken: axiosCancelSource.token
          }
        );
        console.log(response.data);
        timersMaxkey = response.data.sitesystem_timers.length;
        setSitesystem({
          ...response.data,
          sitesystem_timers: response.data.sitesystem_timers.map(
            (sitesystem_timer, index) => {
              sitesystem_timer.key = index;
              return sitesystem_timer;
            }
          )
        });
        axiosCancelSources.splice(
          axiosCancelSources.indexOf(axiosCancelSource),
          1
        );
      } catch (error) {
        console.log(error);
      }
    };
    axiosCancelSources.push(axios.CancelToken.source());
    requestSitesystem(axiosCancelSources.slice(-1));
    return () =>
      axiosCancelSources.map(axiosCancelSource => axiosCancelSource.cancel());
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

  const handleAdd = (timer, characteristic) => {
    setSitesystem({
      ...sitesystem,
      sitesystem_timers: sitesystem.sitesystem_timers.concat([
        {
          ...timer,
          characteristic,
          key: timersMaxkey++
        }
      ])
    });
  };

  const handleDelete = (key, event) => {
    event.preventDefault();
    setSitesystem({
      ...sitesystem,
      sitesystem_timers: sitesystem.sitesystem_timers.filter(
        sitesystem_timer => sitesystem_timer.key !== key
      )
    });
  };

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
          <SitesystemContext.Provider
            value={{ sitesystem, handleAdd, handleDelete }}
          >
            <TimersList editable={true} />
          </SitesystemContext.Provider>
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
