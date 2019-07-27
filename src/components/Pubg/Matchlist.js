import React from "react";
import { Link } from "react-router-dom";

const request = "http://localhost:8080/pubg/players/";

class Matchlist extends React.Component {
  state = {
    matchIdlist: null
  };

  async componentDidMount() {
    const matchIds = await fetch(
      request +
        this.props.match.params.name +
        "?platform=" +
        this.props.match.params.platform
    )
      .then(res => res.json())
      .then(data => data);

    this.setState({
      matchIdlist: matchIds
    });

    console.log(this.state.matchIdlist);
  }

  render() {
    if (this.state.matchIdlist === null) return <p>Loading...</p>;
    return (
      <div>
        <ul>
          {this.state.matchIdlist.map(item => {
            return (
              <li key={item["id"]}>
                <Link to={`${this.props.location.pathname}/${item["id"]}`}>{item["id"]}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Matchlist;
