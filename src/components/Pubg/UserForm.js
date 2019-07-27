import React from "react";
import { withRouter } from "react-router-dom";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      platform: "steam",
      name: ""
    };

    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePlatformChange(event) {
    this.setState({
      platform: event.target.value
    });
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push(
      "/pubg/" + this.state.name + "/" + this.state.platform
    );
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <select
            id="platforms"
            name="plaforms"
            value={this.state.value}
            onChange={this.handlePlatformChange}
          >
            <option value="steam">STEAM</option>
            <option value="kakao">KAKAO</option>
            <option value="xbox">XBOX</option>
            <option value="psn">PSN</option>
          </select>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleNameChange}
          />
          <input type="submit" value="Search" />
        </form>
      </div>
    );
  }
}

export default withRouter(UserForm);
