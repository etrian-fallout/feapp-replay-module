import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Navigation";

const request = "http://localhost:8080/lol/match/matchlists/by-name/";

class LolMatchlist extends React.Component {
  state = {
    matches: null
  };

  async componentDidMount() {
    const list = await fetch(request + this.props.match.params.name)
      .then(res => res.json())
      .then(data => data);

    this.setState({
      matches: list["matches"]
    });
  }

  render() {
    if (this.state.matches === null) return <p>Loading...</p>;
    return (
      <div>
        <Navigation />
        <ul>
          {this.state.matches.map(item => {
            return (
              <li key={item["gameId"]}>
                <Link
                  to={`/lol/${this.props.match.params.name}/${item["gameId"]}`}
                >
                  {item["gameId"]}
                </Link>
                <div>lane : {item["lane"]}</div>
                <div>champion : {item["champion"]}</div>
                <div>role : {item["role"]}</div>
                <div>season : {item["season"]}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default LolMatchlist;
