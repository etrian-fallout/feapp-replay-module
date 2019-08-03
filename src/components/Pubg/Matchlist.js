import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Navigation";

const request1 = "https://bereplay.herokuapp.com/pubg/players/";
const request2 = "https://bereplay.herokuapp.com/pubg/matches/";

class Matchlist extends React.Component {
  state = {
    matchIdlist: null,
    error: null
  };

  replaceMapName = name => {
    switch (name) {
      case "Desert_Main":
        return "Miramar";
      case "DihorOtok_Main":
        return "Vikendi";
      case "Erangel_Main":
        return "Erangel";
      case "Baltic_Main":
        return "Erangel_Remastered";
      case "Range_Main":
        return "Campreturn_Jackal";
      case "Savage_Main":
        return "Sanhok";
      default:
        return name;
    }
  };

  async componentDidMount() {
    const matchIds = await fetch(
      request1 +
        this.props.match.params.name +
        "?platform=" +
        this.props.match.params.platform
    )
      .then(res => res.json())
      .then(data => data);

    if (matchIds.status !== undefined) {
      this.setState({
        error: matchIds.status
      });
      return;
    }
    
    const funcArr = matchIds.map(async x => {
      const url =
        request2 + x["id"] + "?platform=" + this.props.match.params.platform;
      const info = await fetch(url).then(res => res.json());

      return info;
    });

    const infoArr = await Promise.all(funcArr);

    this.setState({
      matchIdlist: matchIds,
      matchInfoList: infoArr
    });
  }

  render() {
    if (this.state.matchIdlist === null && this.state.error === null)
      return <p>Loading...</p>;
    else if (this.state.error !== null)
      return <div>error : {this.state.error}</div>;
    return (
      <div>
        <Navigation />
        <ul>
          {this.state.matchIdlist.map((item, idx) => {
            const mapName = this.replaceMapName(
              this.state.matchInfoList[idx]["data"]["attributes"]["mapName"]
            );
            const time = this.state.matchInfoList[idx]["data"]["attributes"][
              "createdAt"
            ];
            const gameMode = this.state.matchInfoList[idx]["data"][
              "attributes"
            ]["gameMode"];
            const userInfo = this.state.matchInfoList[idx]["included"].filter(
              data =>
                data["type"] === "participant" &&
                data["attributes"]["stats"]["name"] ===
                  this.props.match.params.name
            )[0];
            const kills = userInfo["attributes"]["stats"]["kills"];
            const rank = userInfo["attributes"]["stats"]["winPlace"];
            const asset = this.state.matchInfoList[idx]["included"].filter(
              data => data["type"] === "asset"
            )[0];

            return (
              <li key={item["id"]}>
                <div>
                  <Link
                    to={{
                      pathname: `${this.props.location.pathname}/${item["id"]}`,
                      state: {
                        mapName: mapName,
                        telemetryUrl: asset["attributes"]["url"]
                      }
                    }}
                  >
                    {time}
                  </Link>
                  <div>{`Map : ${mapName}`}</div>
                  <div>{`Game Mode : ${gameMode}`}</div>
                  <div>{`${kills} kills`}</div>
                  <div>{`Rank : ${rank}`}</div>
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
