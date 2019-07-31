import React, { Component } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

class EditModule extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.onChangeTodoCropname = this.onChangeTodoCropname.bind(this);
    this.onChangeTodoCameranum = this.onChangeTodoCameranum.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      module_cropname: "",
      module_imageurl: "",
      module_cameranum: "",
      module_stackid: this.props.match.params.stackid,
      module_updatedat: new Date()
    };
  }

  onChangeTodoCropname(e) {
    this.setState({
      module_cropname: e.target.value
    });
  }

  onChangeTodoCameranum(e) {
    this.setState({
      module_cameranum: e.target.value
    });
  }

  componentDidMount() {
    this._isMounted = true;
    console.log(this.props.match.params.id);

    axios
      .get(
        "http://localhost:4000/sites/" +
          this.props.match.params.siteid +
          "/sitesystems/" +
          this.props.match.params.sitesystemid +
          "/stacks/" +
          this.props.match.params.stackid +
          "/modules/" +
          this.props.match.params.id
      )
      .then(response => {
        this._isMounted &&
          this.setState({
            module_cropname: response.data.module_cropname,
            module_imageurl: response.data.module_imageurl,
            module_cameranum: response.data.module_cameranum
          });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      module_cropname: this.state.module_cropname,
      module_cameranum: this.state.module_cameranum,
      module_updatedat: this.state.module_updatedat
    };
    console.log(obj);
    axios
      .post(
        "http://localhost:4000/sites/" +
          this.props.match.params.siteid +
          "/sitesystems/" +
          this.props.match.params.sitesystemid +
          "/stacks/" +
          this.props.match.params.stackid +
          "/modules/update/" +
          this.props.match.params.id,
        obj
      )
      .then(res => {
        console.log(res.data);
        this.props.history.push(
          "/" +
            this.props.match.params.siteid +
            "/sitesystems" +
            "/" +
            this.props.match.params.sitesystemid +
            "/stacks" +
            "/" +
            this.props.match.params.stackid +
            "/modules"
        );
      });
  }
  render() {
    return (
      <div>
        <h3 align="center">Update Module</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label className="text-white">Crop Name: </label>
            <input
              type="text"
              className="form-control input-text"
              value={this.state.module_cropname}
              onChange={this.onChangeTodoCropname}
            />
          </div>
          <div className="form-group">
            <label className="text-white">Camera Num: </label>
            <input
              type="text"
              className="form-control input-text"
              value={this.state.module_cameranum}
              onChange={this.onChangeTodoCameranum}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Update Module"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(EditModule);
