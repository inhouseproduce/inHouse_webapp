import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

export default class TodosList extends Component {
  constructor(props) {
    super(props);
    this.state = { sites: [] };
  }

  edit(id) {
    this.props.history.push("/edit/" + id);
  }

  delete(id) {
    axios
      .delete("http://localhost:4000/sites/" + id)
      .then(response => {
        let sites = this.state.sites;
        let index = -1;
        let counter = 0;
        for (let site of sites) {
          if (site._id === id) {
            index = counter;
            break;
          }
          counter++;
        }

        if (index !== -1) {
          sites.splice(index, 1);
          this.setState({
            sites: sites
          });
        }
        //this.props.history.push('/todos');
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidMount() {
    axios
      .get("http://localhost:4000/sites/")
      .then(response => {
        this.setState({ sites: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  todoList() {
    const Sites = props => (
      <tr>
        <td>{props.sites.sites_name}</td>
        <td>{props.sites.sites_location}</td>
        <td>{props.sites.sites_createdat}</td>
        <td>{props.sites.sites_updatedat}</td>
        <td>
          <Button variant="primary" onClick={() => this.edit(props.sites._id)}>
            Edit
          </Button>
          <span> </span>
          <Button variant="danger" onClick={() => this.delete(props.sites._id)}>
            Delete
          </Button>
        </td>
      </tr>
    );

    return this.state.sites.map(function(currentTodo, i) {
      return <Sites sites={currentTodo} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <h3>Sites List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
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
