import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class CreateStack extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      stack_createdat: new Date(),
      stack_sitesystemid: this.props.match.params.sitesystemid
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
      .post("http://localhost:4000/stacks/add", newSites)
      .then(res => console.log(res.data));

    this.setState({
      stack_createdat: new Date()
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
                  }/stacks`}
                  className="nav-link"
                >
                  Stacks
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to={`/${this.props.match.params.siteid}/sitesystems/${
                    this.props.match.params.sitesystemid
                  }/stacks/create`}
                  className="nav-link"
                >
                  Create Stacks
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <h3>Create New Stack</h3>
        <form onSubmit={this.onSubmit}>
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
