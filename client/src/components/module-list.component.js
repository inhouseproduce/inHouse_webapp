import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import "../template.css";

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

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(
        "/sites/" +
          this.state.site_id +
          "/sitesystems/" +
          this.state.sitesystem_id +
          "/stacks/" +
          this.state.stack_id +
          "/modules"
      )
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
      <div className="col-sm-4">
        <div className="tile">
          {props.modules.module_imageurl === "" ? (
            <></>
          ) : (
            <img src={props.modules.module_imageurl} />
          )}
          <h5>{props.modules.module_name}</h5>
          <h5>{props.modules.module_cropname}</h5>
          <h5>{props.modules.module_cameranum}</h5>
          <Button
            variant="primary"
            onClick={e => this.edit(props.modules.module_name, e)}
          >
            Edit
          </Button>
        </div>
      </div>
    );

    return this.state.modules.map(function(currentTodo, i) {
      return <Modules modules={currentTodo} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <Button
          className="float-right"
          onClick={() =>
            this.props.history.push(
              "/" +
                this.state.site_id +
                "/sitesystems/" +
                this.state.sitesystem_id +
                "/stacks/" +
                this.state.stack_id +
                "/modules/create"
            )
          }
        >
          <h4> Create Module</h4>
        </Button>
        <br />
        <h3>Modules List</h3>
        <div className="row">{this.todoList()}</div>
      </div>
    );
  }
}

export default withRouter(ModuleList);
