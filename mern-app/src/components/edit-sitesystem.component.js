import React, { Component } from "react";
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
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      sitesystem_updatedat: new Date(),
      sitesystem_hardwareid: "",
      sitesystem_name: ""
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
            sitesystem_hardwareid: response.data.sitesystem_hardwareid
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

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      sitesystem_name: this.state.sitesystem_name,
      sitesystem_hardwareid: this.state.sitesystem_hardwareid,
      sitesystem_updatedat: this.state.sitesystem_updatedat
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
