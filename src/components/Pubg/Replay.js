import React from "react";

class ReplayPubg extends React.Component {
  state = {
    matchId: ""
  };

  componentDidMount() {
    this.setState({
      matchId: this.props.match.params.matchId
    });
  }
  render() {
    return <div>{this.state.matchId}</div>;
  }
}

export default ReplayPubg;
