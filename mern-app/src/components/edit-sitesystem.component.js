import React, { Component } from "react";
import Button from "react-bootstrap/Button";
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
    this.onChangeCharacteristic = this.onChangeCharacteristic.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      sitesystem_updatedat: new Date(),
      sitesystem_hardwareid: "",
      sitesystem_name: "",
      start_time: null,
      duration: 0,
      status: "On",
      characteristic: "Ozone",
      sitesystem_timers: [],
      sitesystem_timers_key: 0
    };
  }

  componentDidMount() {
    this._isMounted = true;

    axios
      .get(
        "http://localhost:4000/sites/" +
          this.props.match.params.siteid +
          "/sitesystems/" +
          this.props.match.params.id
      )
      .then(response => {
        this._isMounted &&
          this.setState({
            sitesystem_name: response.data.sitesystem_name,
            sitesystem_hardwareid: response.data.sitesystem_hardwareid,
            sitesystem_timers: response.data.sitesystem_timers,
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

  onChangeCharacteristic(e) {
    this.setState({
      characteristic: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.sitesystem_timers);
    const obj = {
      sitesystem_name: this.state.sitesystem_name,
      sitesystem_hardwareid: this.state.sitesystem_hardwareid,
      sitesystem_updatedat: this.state.sitesystem_updatedat,
      sitesystem_timers: this.state.sitesystem_timers
    };
    console.log(obj);
    axios
      .post(
        "http://localhost:4000/sites/" +
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
        (element, index) => element.key !== key
      )
    });
  }

  addTimer() {
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
      start_time: null,
      duration: 0,
      status: "On",
      characteristic: "Ozone"
    });
    console.log(this.state.sitesystem_timers);
  }

  timersList() {
    return this.state.sitesystem_timers.map((sitesystem_timer, i) => (
      <tr key="">
        <td>{sitesystem_timer.start_time}</td>
        <td>{sitesystem_timer.duration}</td>
        <td>{sitesystem_timer.status}</td>
        <td>{sitesystem_timer.characteristic}</td>
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
            <div className="form-inline">
              <div className="form-group p-2">
                <label className="text-white">Start Time: </label>
                <input
                  type="time"
                  className="form-control"
                  onChange={this.onChangeStartTime}
                />
              </div>
              <div className="form-group p-2">
                <label className="text-white">Duration: </label>
                <input
                  type="number"
                  className="form-control"
                  onChange={this.onChangeDuration}
                />{" "}
                <span className="text-white">s</span>
              </div>
              <div className="form-group p-2">
                <label className="text-white">Status: </label>
                <select className="form-control" onChange={this.onChangeStatus}>
                  <option>On</option>
                  <option>Off</option>
                </select>
              </div>
              <div className="form-group p-2">
                <label className="text-white">Characteristic: </label>
                <select
                  className="form-control"
                  onChange={this.onChangeCharacteristic}
                >
                  <option>Ozone</option>
                  <option>Pump</option>
                  <option>Lights</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <input
                type="button"
                value="Add Timer"
                className="btn btn-primary"
                onClick={() => this.addTimer()}
              />
            </div>
          </div>
          {this.state.sitesystem_timers.length > 0 ? (
            <>
              <label className="text-white">Timers: </label>
              <table
                className="table table-striped background-white"
                style={{ marginTop: 20 }}
              >
                <thead>
                  <tr>
                    <th>Start Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Characteristic</th>
                    <th>Action</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{this.timersList()}</tbody>
              </table>
            </>
          ) : (
            <></>
          )}
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
  }
}

export default withRouter(EditSitesystem);
