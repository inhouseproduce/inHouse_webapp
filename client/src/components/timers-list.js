import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const TimerModal = props => {
  const { characteristic, show, sitesystem } = props;

  const [timer, setTimer] = useState({
    start_time: "",
    duration: "",
    status: "On"
  });
  const [type, setType] = useState("default");

  const handleChangeStartTime = event =>
    setTimer({ ...timer, start_time: event.target.value });

  const handleChangeDuration = event =>
    setTimer({ ...timer, duration: event.target.value });

  const handleChangeStatus = event =>
    setTimer({ ...timer, status: event.target.value });

  const handleChangeType = event => setType(event.target.value);

  const handleClose = () => {
    setTimer({
      start_time: "",
      duration: "",
      status: "On"
    });
    setType("default");
    props.handleClose();
  };

  const handleAdd = () => {
    if (type === "default") {
      return;
    }
    if (type === "time") {
      if (timer.start_time === "") {
        return;
      }
    } else {
      if (
        timer.duration === "" ||
        sitesystem.sitesystem_timers.find(
          sitesystem_timer =>
            sitesystem_timer.duration &&
            sitesystem_timer.characteristic === characteristic &&
            sitesystem_timer.status === timer.status
        )
      ) {
        return;
      }
    }
    props.handleAdd(timer);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Timer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <select
            className="browser-default custom-select"
            selection
            value={type}
            onChange={handleChangeType}
          >
            <option>Choose your type</option>
            <option value="time">Time</option>
            <option value="interval">Interval</option>
          </select>
          {type === "default" ? (
            <></>
          ) : (
            <div style={{ marginTop: "30px" }}>
              {type === "time" ? (
                <>
                  <label className="text-white">Start Time: </label>
                  <input
                    type="time"
                    className="form-control"
                    onChange={handleChangeStartTime}
                  />
                </>
              ) : (
                <>
                  <label className="text-white">Duration(s): </label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={handleChangeDuration}
                  />
                </>
              )}
              <br />
              <label className="text-white">Status: </label>
              <select className="form-control" onChange={handleChangeStatus}>
                <option>On</option>
                <option>Off</option>
              </select>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const TimersList = props => {
  const { sitesystem, setSitesystem, maxkey, editable } = props;

  const [characteristic, setCharacteristic] = useState("Ozone");
  const [show, setShow] = useState(false);

  const handleDelete = (key, event) => {
    event.preventDefault();
    setSitesystem({
      ...sitesystem,
      sitesystem_timers: sitesystem.sitesystem_timers.filter(
        sitesystem_timer => sitesystem_timer.key !== key
      )
    });
  };

  const handleAdd = timer => {
    setSitesystem({
      ...sitesystem,
      sitesystem_timers: sitesystem.sitesystem_timers.concat([
        {
          ...timer,
          characteristic,
          key: maxkey + 1
        }
      ])
    });
    props.handleAdd();
  };

  const handleClose = () => {
    setCharacteristic("Ozone");
    setShow(false);
  };

  const renderTimersTable = characteristic => {
    return (
      <div className="card custom-card col-sm-4">
        <div className="card-header text-blue">
          {characteristic}
          {editable ? (
            <Button
              className="btn btn-primary"
              onClick={() => {
                setCharacteristic(characteristic);
                setShow(true);
              }}
            >
              Add Timer
            </Button>
          ) : (
            <></>
          )}
        </div>

        <table className="card-table table">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Duration(s)</th>
              <th scope="col">Status</th>
              {editable ? <th scope="col">Action</th> : <></>}
            </tr>
          </thead>
          <tbody>
            {sitesystem.sitesystem_timers
              .filter(
                sitesystem_timer =>
                  sitesystem_timer.characteristic === characteristic
              )
              .map(sitesystem_timer => (
                <tr key={sitesystem_timer.key}>
                  <td>{sitesystem_timer.start_time}</td>
                  <td>{sitesystem_timer.duration}</td>
                  <td>{sitesystem_timer.status}</td>
                  {editable ? (
                    <td>
                      <Button
                        variant="danger"
                        onClick={event =>
                          handleDelete(sitesystem_timer.key, event)
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="row">
      {renderTimersTable("Ozone")}
      {renderTimersTable("Pump")}
      {renderTimersTable("Lights")}
      {editable ? (
        <TimerModal
          characteristic={characteristic}
          show={show}
          handleAdd={handleAdd}
          handleClose={handleClose}
          sitesystem={sitesystem}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TimersList;
