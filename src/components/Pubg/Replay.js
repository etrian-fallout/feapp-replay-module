import React from "react";
import * as PIXI from "pixi.js";
import styles from "./Replay.css";
import Navigation from "../../Navigation";
import Erangel from "../../asset/Erangel_Main_Low_Res.png"
import Erangel_Remastered from "../../asset/Erangel_Remastered_Main_Low_Res.png"
import Miramar from "../../asset/Miramar_Main_Low_Res.png"
import Sanhok from "../../asset/Sanhok_Main_Low_Res.png"
import Vikendi from "../../asset/Vikendi_Main_Low_Res.png"
import Campreturn_Jackal from "../../asset/Camp_Jackal_Main_Low_Res.png"
import CarePackage from '../../asset/CarePackage_Flying.png'

class ReplayPubg extends React.Component {
  state = {
    matchId: "",
    mapName: "",
    telemetryUrl: "",
    replayData: null,
    app: null,
    players: {},
    playerStatus: null,
    survive: 0,
    carePackages: {}
  };

  loadProgressHandler = (loader, resource) => {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
  };

  login = character => {
    const id = character.accountId;

    let newState = Object.assign({}, this.state);
    newState.players[id] = {};
    newState.playerStatus = {};
    this.setState(newState);
  };

  create = character => {
    const id = character.accountId;
    const x = character.location.x / 816;
    const y = character.location.y / 816;

    let circle = new PIXI.Graphics();
    if (character.name === this.props.match.params.name)
      circle.beginFill(0xff00ff);
    else circle.beginFill(0xffffff);
    circle.lineStyle(1, 0x000000);
    circle.drawCircle(0, 0, 7);
    circle.x = x;
    circle.y = y;

    let nameText;
    if (character.name === this.props.match.params.name) {
      nameText = new PIXI.Text(character.name, {
        fontWeight: "50",
        fontSize: "30",
        fill: 0xff0000,
        align: "center"
      });
    } else
      nameText = new PIXI.Text(character.name, {
        fontWeight: "50",
        fontSize: "30",
        fill: 0xffff00,
        align: "center"
      });
    nameText.position.x = x - 30;
    nameText.position.y = y - 20;

    this.state.app.stage.addChild(circle);
    this.state.app.stage.addChild(nameText);

    let newState = Object.assign({}, this.state);
    newState.players[id]["pixi"] = {
      circle: circle,
      name: nameText
    };
    newState.playerStatus[id] = character;
    newState.survive++;
    this.setState(newState);
  };

  matchStart = matchData => {
    const characters = matchData.characters;

    characters.forEach(character => {
      this.create(character);
    });
  };

  position = character => {
    const id = character.accountId;

    if (this.state.players[id]["pixi"] === undefined) {
      return;
    }

    const x = character.location.x / 816;
    const y = character.location.y / 816;

    let newState = Object.assign({}, this.state);
    newState.players[id]["pixi"].circle.x = x;
    newState.players[id]["pixi"].circle.y = y;
    newState.players[id]["pixi"].name.x = x - 30;
    newState.players[id]["pixi"].name.y = y - 20;

    if (character.health === 0) {
      newState.players[id]["pixi"].circle.tint = 0xff0000;
      newState.survive--;
    }
    newState.playerStatus[id] = character;
    this.setState(newState);
  };

  manageCarePackage = (carePackage) => {
    const isGame = carePackage.common.isGame;
    const x = carePackage.itemPackage.location.x / 816;
    const y = carePackage.itemPackage.location.y / 816;

    if(this.state.carePackages[isGame] === undefined) {
      let packageImage = new PIXI.Sprite.from(CarePackage);
      packageImage.scale.x = 0.3;
      packageImage.scale.y = 0.3;
      packageImage.x = x;
      packageImage.y = y;

      this.state.app.stage.addChild(packageImage);

      let newState = Object.assign({}, this.state);
      newState.carePackages[isGame] = packageImage;
      this.setState(newState);
      return;
    }

    let newState = Object.assign({}, this.state);
    newState.carePackages[isGame].x = x;
    newState.carePackages[isGame].y = y;
  }

  setup = () => {
    let camp = new PIXI.Sprite(
      PIXI.loader.resources[`${this.state.mapName}`].texture
    );
    this.state.app.stage.addChild(camp);

    let timeIdx = 0;

    const startIdx = this.state.replayData.findIndex(
      x => x["_T"] === "LogMatchStart"
    );
    const preArr = this.state.replayData.splice(0, startIdx);

    // replay 시작하기 전에 login 이벤트 처리
    preArr
      .filter(x => x["_T"] === "LogPlayerLogin")
      .forEach(x => this.login(x));

    setInterval(() => {
      const x = this.state.replayData[timeIdx];

      switch (x["_T"]) {
        case "LogPlayerLogin":
          this.login(x);
          break;

        case "LogPlayerPosition":
          this.position(x.character);
          break;

        case "LogMatchStart":
          this.matchStart(x);
          break;
        case "LogCarePackageLand":
        case "LogCarePackageSpawn":
            console.log(x)
          this.manageCarePackage(x);
          break;
        default:
          break;
      }

      timeIdx += 1;
      // console.log(`time: ${timeIdx}`);
    }, 2);
  };

  mapResource = mapName => {
    switch(mapName) {
        case "Miramar":
          return Miramar;
        case "Vikendi":
          return Vikendi;
        case "Erangel":
          return Erangel;
        case "Erangel_Remastered":
          return Erangel_Remastered;
        case "Campreturn_Jackal":
          return Campreturn_Jackal;
        case "Sanhok":
          return Sanhok;
        default:
          return mapName;
    }
  }

  async componentDidMount() {
    const app = new PIXI.Application({
      width: 1000,
      height: 1000,
      backgroundColor: 0x000000,
      view: document.getElementById("container")
    });

    document.body.appendChild(app.view);

    await this.setState({
      matchId: this.props.match.params.matchId,
      mapName: this.props.location.state.mapName,
      telemetryUrl: this.props.location.state.telemetryUrl,
      app: app
    });

    const data = await fetch(this.state.telemetryUrl, {
      method: "get",
      headers: new Headers({
        Accept: "application/vnd.api+json",
        "Accept-Encoding": "gzip"
      })
    }).then(res => res.json());

    await this.setState({
      replayData: data
    });
    console.log(this.state.mapName)

    if (PIXI.loader.resources[this.state.mapName] === undefined)
      PIXI.loader.add(
        `${this.state.mapName}`,
        this.mapResource(this.state.mapName)
      );
    PIXI.loader.on("progress", this.loadProgressHandler).load(this.setup);
  }

  componentWillUnmount() {
    for (let i = this.state.app.stage.children.length - 1; i >= 0; i--) {
      this.state.app.stage.removeChild(this.state.app.stage.children[i]);
    }
    document.body.removeChild(this.state.app.view);
  }

  render() {
    if (this.state.playerStatus === null)
      return (
        <div className="user-list">
          <p>Loading...</p>
        </div>
      );

    return (
      <div>
        <Navigation />
        <div className="survive">SURVIVE | {this.state.survive}</div>
        <div className="user-list">
          <ul>
            {Object.entries(this.state.playerStatus).map(user => {
              if (user[1].name === this.props.match.params.name)
                return (
                  <li key={user[0]}>
                    <div className="searched-user">{user[1].name}</div>
                    <div>Health : {user[1].health.toFixed(2)}</div>
                    <div>
                      location : {user[1].location.x.toFixed(0)} ,{" "}
                      {user[1].location.y.toFixed(0)}
                    </div>
                  </li>
                );
              else {
                return (
                  <li key={user[0]}>
                    <div className="other-users">{user[1].name}</div>
                    <div>Health : {user[1].health.toFixed(2)}</div>
                    <div>
                      location : {user[1].location.x.toFixed(0)} ,{" "}
                      {user[1].location.y.toFixed(0)}
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default ReplayPubg;
