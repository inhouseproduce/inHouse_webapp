import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class CreateModule extends Component {
  constructor(props) {
    super(props);

    this.onChangeTodoCropname = this.onChangeTodoCropname.bind(this);
    this.onChangeTodoImageurl = this.onChangeTodoImageurl.bind(this);
    this.onChangeTodoCameranum = this.onChangeTodoCameranum.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      module_createdat: new Date(),
      module_cropname: "",
      module_imageurl: "",
      module_cameranum: "",
      module_stackid: this.props.match.params.stackid
    };
  }

  onChangeTodoCropname(e) {
    this.setState({
      module_cropname: e.target.value
    });
  }

  onChangeTodoImageurl(e) {
    this.setState({
      module_imageurl: e.target.value
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
      module_imageurl: this.state.module_imageurl,
      module_cameranum: this.state.module_cameranum,
      module_stackid: this.state.module_stackid
    };

    axios
      .post("http://localhost:4000/modules/add", newSites)
      .then(res => console.log(res.data));

    this.setState({
      module_createdat: new Date()
    });
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link
                  to={`/${this.props.match.params.siteid}/sitesystems/${
                    this.props.match.params.sitesystemid
                  }/stacks/${this.props.match.params.stackid}/modules`}
                  className="nav-link"
                >
                  Modules
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to={`/${this.props.match.params.siteid}/sitesystems/${
                    this.props.match.params.sitesystemid
                  }/stacks/${this.props.match.params.stackid}/modules/create`}
                  className="nav-link"
                >
                  Create Modules
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <h3>Create New Module</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Crop Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.module_cropname}
              onChange={this.onChangeTodoCropname}
            />
          </div>
          <div className="form-group">
            <label>Image Url: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.module_imageurl}
              onChange={this.onChangeTodoImageurl}
            />
          </div>
          <div className="form-group">
            <label>Camera Num: </label>
            <input
              type="text"
              className="form-control"
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
