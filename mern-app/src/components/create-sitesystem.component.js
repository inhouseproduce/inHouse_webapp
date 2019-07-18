import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class CreateSitesystem extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      sitesystem_createdat: new Date(),
      sitesystem_updatedat: "",
      sitesystem_siteid: this.props.match.params.siteid
    };
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(`Todo Priority: ${this.state.sitesystem_createdat}`);

    const newSites = {
      sitesystem_createdat: this.state.sitesystem_createdat,
      sitesystem_updatedat: this.state.sitesystem_updatedat,
      sitesystem_siteid: this.state.sitesystem_siteid
    };

    axios
      .post("http://localhost:4000/sitesystems/add", newSites)
      .then(res => console.log(res.data));

    this.setState({
      sitesystem_updatedat: "",
      sitesystem_createdat: new Date()
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
                  to={`/${this.props.match.params.siteid}/sitesystems`}
                  className="nav-link"
                >
                  Sitesystem
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to={`/${this.props.match.params.siteid}/sitesystems/create`}
                  className="nav-link"
                >
                  Create Sitesystem
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <h3>Create New Site</h3>
        <form onSubmit={this.onSubmit}>
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
