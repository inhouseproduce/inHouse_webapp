import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import "../template.css";

class StackList extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      stack_createdat: new Date(),
      stacks: [],
      sitesystem_id: props.match.params.sitesystemid,
      site_id: props.match.params.siteid,
      sitesystem_timers: [],
      sitesystem_timers_key: 0
    };
  }

  createstack(e) {
    e.preventDefault();
    const newSites = {
      stack_createdat: this.state.stack_createdat,
      stack_sitesystemid: this.state.sitesystem_id
    };

    axios
      .post(
        "http://localhost:4000/sites/" +
          this.props.match.params.siteid +
          "/sitesystems/" +
          this.props.match.params.sitesystemid +
          "/stacks/add",
        newSites
      )
      .then(res => {
        if (res.status === 401) console.log(res.data);
        console.log(res.data);
        axios
          .get(
            "http://localhost:4000/" +
              "sites/" +
              this.state.site_id +
              "/sitesystems/" +
              this.state.sitesystem_id +
              "/stacks"
          )
          .then(response => {
            console.log(response.data);
            this._isMounted && this.setState({ stacks: response.data });
          })
          .catch(function(error) {
            console.log(error);
          });
      });
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(
        "http://localhost:4000/" +
          "sites/" +
          this.state.site_id +
          "/sitesystems/" +
          this.state.sitesystem_id +
          "/stacks"
      )
      .then(response => {
        console.log(response.data);
        this._isMounted && this.setState({ stacks: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
    axios
      .get(
        "http://localhost:4000/sites/" +
          this.state.site_id +
          "/sitesystems/" +
          this.state.sitesystem_id.split("_").pop()
      )
      .then(response => {
        this._isMounted &&
          this.setState({
            sitesystem_timers: response.data.sitesystem_timers.map(
              (element, index) => {
                element.key = index;
                return element;
              }
            ),
            sitesystem_timers_key: response.data.sitesystem_timers.length
          });
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
      <div className="col-sm-4">
        <Link
          to={`/${this.state.site_id}/sitesystems/${
            this.state.sitesystem_id
          }/stacks/${props.stacks.stack_name}/modules`}
          className="tile"
        >
          <h5>{props.stacks.stack_name}</h5>
        </Link>
      </div>
    );

    return this.state.stacks.map(function(currentTodo, i) {
      return <Stacks stacks={currentTodo} key={i} />;
    });
  }

  timersList(characteristic) {
    return this.state.sitesystem_timers
      .filter(element => element.characteristic === characteristic)
      .map((sitesystem_timer, i) => (
        <tr key={sitesystem_timer.key}>
          <td>{sitesystem_timer.start_time}</td>
          <td>{sitesystem_timer.duration}</td>
          <td>{sitesystem_timer.status}</td>
        </tr>
      ));
  }

  render() {
    return (
      <div>
        <Button className="float-right" onClick={e => this.createstack(e)}>
          <h4>Create Stack</h4>
        </Button>
        <br />
        <h3>Scheduling Data</h3>
        <div className="row">
          <div className="card custom-card col-sm-4">
            <div className="card-header text-blue">Ozone</div>

            <table className="card-table table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Duration(s)</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>{this.timersList("Ozone")}</tbody>
            </table>
          </div>
          <div className="card custom-card col-sm-4">
            <div className="card-header text-blue">Pump</div>

            <table className="card-table table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Duration(s)</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>{this.timersList("Pump")}</tbody>
            </table>
          </div>
          <div className="card custom-card col-sm-4">
            <div className="card-header text-blue">Lights</div>

            <table className="card-table table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Duration(s)</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>{this.timersList("Lights")}</tbody>
            </table>
          </div>
        </div>
        <br />
        <h3>Stacks List</h3>
        <div className="row">{this.todoList()}</div>
      </div>
    );
  }
}

export default withRouter(StackList);
