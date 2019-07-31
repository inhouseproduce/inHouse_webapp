import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class CreateSitesystem extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.onChangeTodoHardwareid = this.onChangeTodoHardwareid.bind(this);
    this.onChangeTodoSitesystemname = this.onChangeTodoSitesystemname.bind(
      this
    );

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      sitesystem_createdat: new Date(),
      sitesystem_updatedat: "",
      sitesystem_siteid: this.props.match.params.siteid,
      sitesystem_hardwareid: "",
      sitesystem_name: ""
    };
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
    console.log(`Todo Priority: ${this.state.sitesystem_createdat}`);

    const newSites = {
      sitesystem_createdat: this.state.sitesystem_createdat,
      sitesystem_updatedat: this.state.sitesystem_updatedat,
      sitesystem_siteid: this.state.sitesystem_siteid,
      sitesystem_hardwareid: this.state.sitesystem_hardwareid,
      sitesystem_name: this.state.sitesystem_name
    };

    axios
      .post(
        "http://localhost:4000/sites/" +
          this.props.match.params.siteid +
          "/sitesystems/add",
        newSites
      )
      .then(res => {
        if (res.status === 401) console.log(res.data);
        this.props.history.push(
          "/" + this.state.sitesystem_siteid + "/sitesystems"
        );
      });
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Create New Site System</h3>
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
              value="Create Site System"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(CreateSitesystem);
