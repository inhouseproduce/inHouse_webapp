import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class CreateStack extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      stack_createdat: new Date(),
      stack_sitesystemid: this.props.match.params.sitesystemid,
      stack_siteid: this.props.match.params.siteid
    };
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(`Todo Priority: ${this.state.stack_createdat}`);

    const newSites = {
      stack_createdat: this.state.stack_createdat,
      stack_sitesystemid: this.state.stack_sitesystemid
    };

    axios
      .post(
        "http://localhost:4000//sites/" +
          this.props.match.params.siteid +
          "/sitesystems/" +
          this.props.match.params.sitesystemid +
          "/stacks/add",
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
        <h3>Create New Stack</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Stack Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.stack_name}
              onChange={this.onChangeTodoStackname}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create Stack"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(CreateStack);
