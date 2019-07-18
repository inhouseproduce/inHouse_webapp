import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";

class SitesystemList extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = { sitesystems: [], site_id: props.match.params.siteid };
  }

  edit(id) {
    console.log(this.state.site_id + "/sitesystems/edit/" + id);
    this.props.history.push(
      "/" + this.state.site_id + "/sitesystems/edit/" + id
    );
  }

  delete(id) {
    console.log(id);
    axios
      .delete("http://localhost:4000/sitesystems/" + id)
      .then(response => {
        let sitesystems = this.state.sitesystems;
        let index = -1;
        let counter = 0;
        for (let site of sitesystems) {
          if (site._id === id) {
            index = counter;
            break;
          }
          counter++;
        }

        if (index !== -1) {
          sitesystems.splice(index, 1);
          this._isMounted &&
            this.setState({
              sitesystems: sitesystems
            });
        }
        //this.props.history.push('/todos');
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidMount() {
    console.log("http://localhost:4000/sitesystems/" + this.state.site_id);
    this._isMounted = true;
    axios
      .get("http://localhost:4000/sitesystems/" + this.state.site_id)
      .then(response => {
        console.log(response.data);
        this._isMounted && this.setState({ sitesystems: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  todoList() {
    const Sitesystems = props => (
      <tr>
        <td>
          <Link
            to={`/${this.state.site_id}/sitesystems/${
              props.sitesystems._id
            }/stacks`}
            className="nav-link"
          >
            {props.sitesystems._id}
          </Link>
        </td>

        <td>{props.sitesystems.sitesystem_createdat}</td>
        <td>{props.sitesystems.sitesystem_updatedat}</td>
        <td>
          <Button
            variant="primary"
            onClick={() => this.edit(props.sitesystems._id)}
          >
            Edit
          </Button>
          <span> </span>
          <Button
            variant="danger"
            onClick={() => this.delete(props.sitesystems._id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    );

    return this.state.sitesystems.map(function(currentTodo, i) {
      return <Sitesystems sitesystems={currentTodo} key={i} />;
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
        <h3>Sitesystem List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.todoList()}</tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(SitesystemList);
