import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class EditTodo extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.onChangeTodoName = this.onChangeTodoName.bind(this);
    this.onChangeTodoLocation = this.onChangeTodoLocation.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      todo_name: "",
      todo_location: "",
      todo_updatedat: new Date()
    };
  }

  componentDidMount() {
    this._isMounted = true;
    console.log(this.props.match.params.id);

    axios
      .get("/sites/" + this.props.match.params.id)
      .then(response => {
        // console.log(response.data);
        this._isMounted &&
          this.setState({
            todo_name: response.data.sites_name,
            todo_location: response.data.sites_location
          });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChangeTodoName(e) {
    this.setState({
      todo_name: e.target.value
    });
  }

  onChangeTodoLocation(e) {
    this.setState({
      todo_location: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      sites_name: this.state.todo_name,
      sites_location: this.state.todo_location,
      sites_updatedat: this.state.todo_updatedat
    };
    console.log(obj);
    axios
      .post(
        "/sites/update/" + this.props.match.params.id,
        obj
      )
      .then(res => {
        console.log(res.data);
        this.props.history.push("/");
      });
  }
  render() {
    return (
      <div>
        <h3 align="center">Update Sites</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label className="text-white">Name: </label>
            <br />
            <input
              type="text"
              className="form-control"
              value={this.state.todo_name}
              onChange={this.onChangeTodoName}
            />
          </div>
          <div className="form-group">
            <label className="text-white">Location: </label>
            <br />
            <input
              type="text"
              className="form-control"
              value={this.state.todo_location}
              onChange={this.onChangeTodoLocation}
            />
          </div>

          <br />

          <div className="form-group">
            <input
              type="submit"
              value="Update Sites"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(EditTodo);
