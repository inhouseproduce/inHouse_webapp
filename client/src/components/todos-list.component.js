import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { withRouter, Link } from "react-router-dom";
import "../template.css";

class TodosList extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = { sites: [] };
  }

  edit(id, e) {
    e.preventDefault();
    this.props.history.push("/edit/" + id);
  }

  delete(id, e) {
    e.preventDefault();
    axios
      .delete("/sites/" + id)
      .then(response => {
        let sites = this.state.sites;
        let index = -1;
        let counter = 0;
        for (let site of sites) {
          if (site.sites_name === id) {
            index = counter;
            break;
          }
          counter++;
        }

        if (index !== -1) {
          sites.splice(index, 1);
          this._isMounted &&
            this._isMounted &&
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
    this._isMounted = true;
    axios
      .get("/sites/")
      .then(response => {
        console.log(response.data);
        this._isMounted && this.setState({ sites: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  todoList() {
    const Sites = props => (
      <div className="col-sm-4">
        <Link to={`/${props.sites.sites_name}/sitesystems`} className="tile">
          <h5>
            {props.sites.sites_name}
            <br />

            {props.sites.sites_location}
          </h5>

          <Button
            variant="primary"
            onClick={e => this.edit(props.sites.sites_name, e)}
          >
            Edit
          </Button>
          <span> </span>
          <Button
            variant="danger"
            onClick={e => this.delete(props.sites.sites_name, e)}
          >
            Delete
          </Button>
        </Link>
      </div>
    );

    return this.state.sites.map(function(currentTodo, i) {
      return <Sites sites={currentTodo} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <Button
          className="float-right"
          onClick={() => this.props.history.push("/create")}
        >
          <h4> Create Sites</h4>
        </Button>

        <br />
        <h3>Sites List</h3>
        <br />
        <div className="row">{this.todoList()}</div>
      </div>
    );
  }
}

export default withRouter(TodosList);
