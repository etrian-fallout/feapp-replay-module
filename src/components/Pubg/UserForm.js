import React from "react";

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
    console.log('a platform was submitted: ' + this.state.platform);
    console.log("a name was submitted: " + this.state.name);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <select id="platforms" name="plaforms" value={this.state.value} onChange={this.handlePlatformChange}>
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
    );
  }
}

export default UserForm;
