import React from "react";

const request_info = "http://localhost:8080/lol/match/matches/";
const request_timeline = "http://localhost:8080/lol/match/timelines/";

class LolReplay extends React.Component {
  state = {
    matchInfo: null,
    timelines: null
  };

  async componentDidMount() {
    const info = await fetch(
      request_info + this.props.match.params.matchId
    ).then(res => res.json());

    const lines = await fetch(
      request_timeline + this.props.match.params.matchId
    ).then(res => res.json());

    this.setState({
      matchInfo: info,
      timelines: lines
    });

    console.log(this.state);
  }

  render() {
    if (this.state.matchInfo === null || this.state.timelines == null)
      return <p>Loading...</p>;
    return <div>LOL Replay</div>;
  }
}

export default LolReplay;
