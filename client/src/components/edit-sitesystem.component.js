import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class EditSitesystem extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this._isMounted = false;

    this.onChangeTodoHardwareid = this.onChangeTodoHardwareid.bind(this);
    this.onChangeTodoSitesystemname = this.onChangeTodoSitesystemname.bind(
      this
    );
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      sitesystem_updatedat: new Date(),
      sitesystem_hardwareid: "",
      sitesystem_name: "",
      start_time: "",
      duration: "",
      status: "On",
      characteristic: "Ozone",
      sitesystem_timers: [],
      sitesystem_timers_key: 0,
      add_timer_modal_show: false,
      selectedValue: "default"
    };
  }

  componentDidMount() {
    this._isMounted = true;

    axios
      .get(
        "/sites/" +
          this.props.match.params.siteid +
          "/sitesystems/" +
          this.props.match.params.id
      )
      .then(response => {
        this._isMounted &&
          this.setState({
            sitesystem_name: response.data.sitesystem_name,
            sitesystem_hardwareid: response.data.sitesystem_hardwareid,
            sitesystem_timers: response.data.sitesystem_timers.map(
              (element, index) => {
                element.key = index;
                return element;
              }
            ),
            sitesystem_timers_key: response.data.sitesystem_timers.length
          });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = e => {
    console.log(e.target.value);
    this.setState({ selectedValue: e.target.value });
  };

  onChangeTodoHardwareid(e) {
    this.setState({
      sitesystem_hardwareid: e.target.value
    });
  }

  onChangeTodoSitesystemname(e) {
    this.setState({
      sitesystem_name: e.target.value
    });
  }

  onChangeStartTime(e) {
    this.setState({
      start_time: e.target.value
    });
  }

  onChangeDuration(e) {
    this.setState({
      duration: e.target.value
    });
  }

  onChangeStatus(e) {
    console.log(e);
    this.setState({
      status: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      sitesystem_name: this.state.sitesystem_name,
      sitesystem_hardwareid: this.state.sitesystem_hardwareid,
      sitesystem_updatedat: new Date(),
      sitesystem_timers: this.state.sitesystem_timers.map(element => {
        delete element.key;
        return element;
      })
    };
    console.log(obj);
    axios
      .post(
        "/sites/" +
          this.props.match.params.siteid +
          "/sitesystems/update/" +
          this.props.match.params.id,
        obj
      )
      .then(res => {
        console.log(res.data);
        this.props.history.push(
          "/" + this.props.match.params.siteid + "/sitesystems"
        );
      });
  }

  deleteTimer(key, e) {
    e.preventDefault();
    this.setState({
      sitesystem_timers: this.state.sitesystem_timers.filter(
        element => element.key !== key
      )
    });
  }

  addTimer() {
    if (this.state.selectedValue === "default") {
      return;
    }
    if (this.state.selectedValue === "1") {
      if (this.state.start_time === "") {
        return;
      }
    } else {
      if (
        this.state.duration === "" ||
        this.state.sitesystem_timers.find(
          element =>
            element.duration !== "" &&
            element.characteristic === this.state.characteristic &&
            element.status === this.state.status
        )
      ) {
        return;
      }
    }
    this.setState({
      sitesystem_timers: this.state.sitesystem_timers.concat([
        {
          start_time: this.state.start_time,
          duration: this.state.duration,
          status: this.state.status,
          characteristic: this.state.characteristic,
          key: this.state.sitesystem_timers_key++
        }
      ]),
      start_time: "",
      duration: "",
      status: "On",
      characteristic: "Ozone",
      add_timer_modal_show: false,
      selectedValue: "default"
    });
  }

  timersList(characteristic) {
    return this.state.sitesystem_timers
      .filter(element => element.characteristic === characteristic)
      .map((sitesystem_timer, i) => (
        <tr key={sitesystem_timer.key}>
          <td>{sitesystem_timer.start_time}</td>
          <td>{sitesystem_timer.duration}</td>
          <td>{sitesystem_timer.status}</td>
          <td>
            <Button
              variant="danger"
              onClick={e => this.deleteTimer(sitesystem_timer.key, e)}
            >
              Delete
            </Button>
          </td>
        </tr>
      ));
  }

  render() {
    return (
      <div>
        <h3 align="center">Update Sitesystem</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label className="text-white">Sitesystem Name: </label>
            <input
              type="text"
              className="form-control input-text"
              value={this.state.sitesystem_name}
              onChange={this.onChangeTodoSitesystemname}
            />
          </div>
          <div className="form-group">
            <label className="text-white">Hardware Id: </label>
            <input
              type="text"
              className="form-control input-text"
              value={this.state.sitesystem_hardwareid}
              onChange={this.onChangeTodoHardwareid}
            />
          </div>
          <div className="form-group">
            <label className="text-white">Scheduling Data: </label>
          </div>
          <div className="row">
            <div className="card custom-card col-sm-4">
              <div className="card-header text-blue">
                Ozone
                <Button
                  className="btn btn-primary"
                  onClick={() =>
                    this.setState({
                      add_timer_modal_show: true,
                      characteristic: "Ozone"
                    })
                  }
                >
                  Add Timer
                </Button>
              </div>

              <table className="card-table table">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Duration(s)</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>{this.timersList("Ozone")}</tbody>
              </table>
            </div>
            <div className="card custom-card col-sm-4">
              <div className="card-header text-blue">
                Pump
                <Button
                  className="btn btn-primary"
                  onClick={() =>
                    this.setState({
                      add_timer_modal_show: true,
                      characteristic: "Pump"
                    })
                  }
                >
                  Add Timer
                </Button>
              </div>

              <table className="card-table table">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Duration(s)</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>{this.timersList("Pump")}</tbody>
              </table>
            </div>
            <div className="card custom-card col-sm-4">
              <div className="card-header text-blue">
                Lights
                <Button
                  className="btn btn-primary"
                  onClick={() =>
                    this.setState({
                      add_timer_modal_show: true,
                      characteristic: "Lights"
                    })
                  }
                >
                  Add Timer
                </Button>
              </div>

              <table className="card-table table">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Duration(s)</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>{this.timersList("Lights")}</tbody>
              </table>
            </div>

            <div className="form-group">
              <br />
              <input
                type="submit"
                value="Update Sitesystem"
                className="btn btn-primary"
              />
            </div>
          </div>
        </form>

        <Modal
          show={this.state.add_timer_modal_show}
          onHide={() => this.setState({ add_timer_modal_show: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Timer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <select
                className="browser-default custom-select"
                selection
                value={this.state.selectedValue}
                onChange={this.handleChange}
              >
                <option>Choose your option</option>
                <option value="1">Time</option>
                <option value="2">Interval</option>
              </select>
              {this.state.selectedValue === "1" ? (
                <div style={{ marginTop: "30px" }}>
                  <label className="text-white">Start Time: </label>
                  <input
                    type="time"
                    className="form-control"
                    onChange={this.onChangeStartTime}
                  />
                  <br />
                  <label className="text-white">Status: </label>
                  <select
                    className="form-control"
                    onChange={this.onChangeStatus}
                  >
                    <option>On</option>
                    <option>Off</option>
                  </select>
                </div>
              ) : (
                <></>
              )}
              {this.state.selectedValue === "2" ? (
                <div style={{ marginTop: "30px" }}>
                  <label className="text-white">Duration(s): </label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={this.onChangeDuration}
                  />
                  <br />
                  <label className="text-white">Status: </label>
                  <select
                    className="form-control"
                    onChange={this.onChangeStatus}
                  >
                    <option>On</option>
                    <option>Off</option>
                  </select>
                </div>
              ) : (
                <></>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                this.setState({
                  start_time: "",
                  duration: "",
                  status: "On",
                  characteristic: "Ozone",
                  add_timer_modal_show: false,
                  selectedValue: "default"
                })
              }
            >
              Close
            </Button>
            <Button variant="primary" onClick={() => this.addTimer()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withRouter(EditSitesystem);
