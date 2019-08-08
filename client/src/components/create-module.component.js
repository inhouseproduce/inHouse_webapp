import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class CreateModule extends Component {
  constructor(props) {
    super(props);

    this.onChangeTodoCropname = this.onChangeTodoCropname.bind(this);
    this.onChangeTodoCameranum = this.onChangeTodoCameranum.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      module_createdat: new Date(),
      module_cropname: "",
      module_cameranum: "",
      module_stackid: this.props.match.params.stackid,
      module_sitesystemid: this.props.match.params.sitesystemid,
      module_siteid: this.props.match.params.siteid
    };
  }

  onChangeTodoCropname(e) {
    this.setState({
      module_cropname: e.target.value
    });
  }

  onChangeTodoCameranum(e) {
    this.setState({
      module_cameranum: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(`Todo Priority: ${this.state.module_createdat}`);

    const newSites = {
      module_createdat: new Date(),
      module_cropname: this.state.module_cropname,
      module_cameranum: this.state.module_cameranum,
      module_stackid:
        this.state.module_sitesystemid + "_" + this.state.module_stackid
    };

    axios
      .post(
        "/sites/" +
          this.props.match.params.siteid +
          "/sitesystems/" +
          this.props.match.params.sitesystemid +
          "/stacks/" +
          this.props.match.params.stackid +
          "/modules/add",
        newSites
      )
      .then(res => {
        if (res.status === 401) console.log(res.data);
        this.props.history.push(
          "/" +
            this.props.match.params.siteid +
            "/sitesystems/" +
            this.props.match.params.sitesystemid +
            "/stacks/" +
            this.props.match.params.stackid +
            "/modules"
        );
      });
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Create New Module</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label className="text-white">Crop Name: </label>
            <input
              type="text"
              className="form-control input-text"
              value={this.state.module_cropname}
              onChange={this.onChangeTodoCropname}
            />
          </div>

          <div className="form-group">
            <label className="text-white">Camera Num: </label>
            <input
              type="text"
              className="form-control input-text"
              value={this.state.module_cameranum}
              onChange={this.onChangeTodoCameranum}
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Create Module"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(CreateModule);
