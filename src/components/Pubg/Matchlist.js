import React from "react";
import { Link } from "react-router-dom";

const request1 = "http://localhost:8080/pubg/players/";
const request2 = "http://localhost:8080/pubg/matches/";

class Matchlist extends React.Component {
  state = {
    matchIdlist: null
  };

  replaceMapName = name => {
    switch (name) {
      case "Desert_Main": return "Miramar";
      case "DihorOtok_Main": return "Vikendi";
      case "Erangel_Main": return "Erangel";
      case "Baltic_Main": return "Erangel_Remastered";
      case "Range_Main": return "Campreturn  Jackal";
      case "Savage_Main": return "Sanhok";
      default: return name;
    }
  }

  async componentDidMount() {
    const matchIds = await fetch(
      request1 +
      this.props.match.params.name +
      "?platform=" +
      this.props.match.params.platform
    )
      .then(res => res.json())
      .then(data => data);

    const tempArr = matchIds.splice(0, 3);

    const funcArr = tempArr.map(async x => {
      const url = request2 + x["id"] + "?platform=" + this.props.match.params.platform;
      const info = await fetch(url).then(res => res.json());

      return info;
    })

    const infoArr = await Promise.all(funcArr)

    this.setState({
      matchIdlist: tempArr,
      matchInfoList: infoArr
    });
  }

  render() {
    if (this.state.matchIdlist === null) return <p>Loading...</p>;
    return (
      <div>
        <ul>
          {this.state.matchIdlist.map((item, idx) => {
            const mapName = this.replaceMapName(this.state.matchInfoList[idx]["data"]["attributes"]["mapName"]);
            const time = this.state.matchInfoList[idx]["data"]["attributes"]["createdAt"];

            return (
              <li key={item["id"]}>
                <div>
                  <Link to={{
                    pathname: `${this.props.location.pathname}/${item["id"]}`,
                    state: {
                      mapName: mapName,
                      telemetryUrl: this.state.matchInfoList[idx]["included"][0]["attributes"]["url"]
                    }
                  }}>
                    <h2>{item["id"]}</h2>
                  </Link>
                  <div>{`time: ${time}`}</div>
                  <div>{`map name: ${mapName}`}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Matchlist;
