import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import "../template.css";

class SitesystemList extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = { sitesystems: [], site_id: props.match.params.siteid };
  }

  edit(id, e) {
    e.preventDefault();
    this.props.history.push(
      "/" + this.state.site_id + "/sitesystems/edit/" + id
    );
  }

  delete(id, e) {
    e.preventDefault();
    axios
      .delete(
        "http://localhost:4000/sites/" +
          this.state.site_id +
          "/sitesystems/" +
          id
      )
      .then(response => {
        let sitesystems = this.state.sitesystems;
        let index = -1;
        let counter = 0;
        for (let site of sitesystems) {
          if (site.sitesystem_hardwareid === id) {
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
    console.log(
      "http://localhost:4000/" + "sites/" + this.state.site_id + "/sitesystems/"
    );
    this._isMounted = true;
    axios
      .get(
        "http://localhost:4000/" +
          "sites/" +
          this.state.site_id +
          "/sitesystems"
      )
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
      <div className="col-sm-4">
        <Link
          to={`/${this.state.site_id}/sitesystems/${
            props.sitesystems.sitesystem_name
          }_${props.sitesystems.sitesystem_hardwareid}/stacks`}
          className="tile"
        >
          <h5>
            {props.sitesystems.sitesystem_name}
            <br />
            {props.sitesystems.sitesystem_hardwareid}
          </h5>
          <Button
            variant="primary"
            onClick={e => this.edit(props.sitesystems.sitesystem_hardwareid, e)}
          >
            Edit
          </Button>
          <span> </span>
          <Button
            variant="danger"
            onClick={e =>
              this.delete(props.sitesystems.sitesystem_hardwareid, e)
            }
          >
            Delete
          </Button>
        </Link>
      </div>
    );

    return this.state.sitesystems.map(function(currentTodo, i) {
      return <Sitesystems sitesystems={currentTodo} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <Button
          className="float-right"
          onClick={() =>
            this.props.history.push(
              "/" + this.state.site_id + "/sitesystems/create"
            )
          }
        >
          <h4> Create Sitesystem</h4>
        </Button>
        <br />
        <h3>Sitesystem List</h3>
        <div className="row">{this.todoList()}</div>
      </div>
    );
  }
}

export default withRouter(SitesystemList);
