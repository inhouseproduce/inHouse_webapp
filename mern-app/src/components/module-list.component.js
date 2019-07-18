import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";

class ModuleList extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      modules: [],
      stack_id: props.match.params.stackid,
      site_id: props.match.params.siteid,
      sitesystem_id: props.match.params.sitesystemid
    };
  }

  edit(id) {
    console.log(this.state.site_id + "/sitesystems/edit/" + id);
    this.props.history.push(
      "/" +
        this.state.site_id +
        "/sitesystems/" +
        this.state.sitesystem_id +
        "/stacks/" +
        this.state.stack_id +
        "/modules/edit/" +
        id
    );
  }

  delete(id) {
    console.log(id);
    axios
      .delete("http://localhost:4000/modules/" + id)
      .then(response => {
        let modules = this.state.modules;
        let index = -1;
        let counter = 0;
        for (let module of modules) {
          if (module._id === id) {
            index = counter;
            break;
          }
          counter++;
        }

        if (index !== -1) {
          modules.splice(index, 1);
          this._isMounted &&
            this.setState({
              modules: modules
            });
        }
        //this.props.history.push('/todos');
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get("http://localhost:4000/modules/" + this.state.stack_id)
      .then(response => {
        console.log(response.data);
        this._isMounted && this.setState({ modules: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  todoList() {
    const Modules = props => (
      <tr>
        <td>{props.modules.module_cropname}</td>
        <td>{props.modules.module_imageurl}</td>
        <td>{props.modules.module_cameranum}</td>
        <td>{props.modules.module_createdat}</td>
        <td>{props.modules.module_updatedat}</td>
        <td>
          <Button
            variant="primary"
            onClick={() => this.edit(props.modules._id)}
          >
            Edit
          </Button>
          <span> </span>
          <Button
            variant="danger"
            onClick={() => this.delete(props.modules._id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    );

    return this.state.modules.map(function(currentTodo, i) {
      return <Modules modules={currentTodo} key={i} />;
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
        <h3>Modules List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Crop Name</th>
              <th>Image url</th>
              <th>Camera Num</th>
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

export default withRouter(ModuleList);
