import React, { Component } from "react";
import axios from "axios";

export default class CreateTodo extends Component {
  constructor(props) {
    super(props);

    this.onChangeTodoName = this.onChangeTodoName.bind(this);
    this.onChangeTodoLocation = this.onChangeTodoLocation.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      todo_name: "",
      todo_location: "",
      todo_createdat: new Date(),
      todo_updatedat: ""
    };
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

    console.log(`Form submitted:`);
    console.log(`Todo Name: ${this.state.todo_name}`);
    console.log(`Todo Location: ${this.state.todo_location}`);
    console.log(`Todo Priority: ${this.state.todo_createdat}`);

    const newSites = {
      sites_name: this.state.todo_name,
      sites_location: this.state.todo_location,
      sites_createdat: this.state.todo_createdat,
      sites_updatedat: this.state.todo_updatedat
    };

    axios
      .post("http://localhost:4000/sites/add", newSites)
      .then(res => console.log(res.data));

    this.setState({
      todo_name: "",
      todo_location: "",
      todo_updatedat: "",
      todo_createdat: new Date()
    });
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Create New Todo</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.todo_name}
              onChange={this.onChangeTodoName}
            />
          </div>
          <div className="form-group">
            <label>Location: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.todo_location}
              onChange={this.onChangeTodoLocation}
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Create Sites"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
