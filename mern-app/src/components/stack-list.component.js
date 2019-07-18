import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";

class StackList extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      stacks: [],
      sitesystem_id: props.match.params.sitesystemid,
      site_id: props.match.params.siteid
    };
  }

  delete(id) {
    console.log(id);
    axios
      .delete("http://localhost:4000/stacks/" + id)
      .then(response => {
        let stacks = this.state.stacks;
        let index = -1;
        let counter = 0;
        for (let stack of stacks) {
          if (stack._id === id) {
            index = counter;
            break;
          }
          counter++;
        }

        if (index !== -1) {
          stacks.splice(index, 1);
          this._isMounted &&
            this.setState({
              stacks: stacks
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
      .get("http://localhost:4000/stacks/" + this.state.sitesystem_id)
      .then(response => {
        console.log(response.data);
        this._isMounted && this.setState({ stacks: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  todoList() {
    const Stacks = props => (
      <tr>
        <td>
          {" "}
          <Link
            to={`/${this.state.site_id}/sitesystems/${
              this.state.sitesystem_id
            }/stacks/${props.stacks._id}/modules`}
            className="nav-link"
          >
            {props.stacks._id}
          </Link>
        </td>
        <td>{props.stacks.stack_createdat}</td>
        <td>
          <Button
            variant="danger"
            onClick={() => this.delete(props.stacks._id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    );

    return this.state.stacks.map(function(currentTodo, i) {
      return <Stacks stacks={currentTodo} key={i} />;
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
        <h3>Stack List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.todoList()}</tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(StackList);
