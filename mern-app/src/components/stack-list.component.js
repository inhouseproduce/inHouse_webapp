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
      site_id: props.match.params.siteid
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

  render() {
    return (
      <div>
        <Button className="float-right" onClick={e => this.createstack(e)}>
          <h4>Create Stack</h4>
        </Button>
        <br />
        <h3>Stacks List</h3>
        <div className="row">{this.todoList()}</div>
      </div>
    );
  }
}

export default withRouter(StackList);
