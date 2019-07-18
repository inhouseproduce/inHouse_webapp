import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class EditSitesystem extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this._isMounted = false;

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      sitesystem_updatedat: new Date()
    };
  }

  componentDidMount() {
    this._isMounted = true;

    axios
      .get(
        "http://localhost:4000/sitesystems/systems/" +
          this.props.match.params.id
      )
      .then(response => {})
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      sitesystem_updatedat: this.state.sitesystem_updatedat
    };
    console.log(obj);
    axios
      .post(
        "http://localhost:4000/sitesystems/update/" +
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
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link
                  to={`/${this.props.match.params.id}/sitesystems`}
                  className="nav-link"
                >
                  Sitesystem
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to={`/${this.props.match.params.id}/sitesystems/create`}
                  className="nav-link"
                >
                  Create Sitesystem
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <h3 align="center">Update Sitesystem</h3>
        <form onSubmit={this.onSubmit}>
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
