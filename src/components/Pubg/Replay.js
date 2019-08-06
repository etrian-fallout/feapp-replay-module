import React from "react";
import * as PIXI from "pixi.js";
import styles from "./Replay.css";
import Navigation from "../../Navigation";
import Erangel from "../../asset/Erangel_Main_Low_Res.png";
import Erangel_Remastered from "../../asset/Erangel_Remastered_Main_Low_Res.png";
import Miramar from "../../asset/Miramar_Main_Low_Res.png";
import Sanhok from "../../asset/Sanhok_Main_Low_Res.png";
import Vikendi from "../../asset/Vikendi_Main_Low_Res.png";
import Campreturn_Jackal from "../../asset/Camp_Jackal_Main_Low_Res.png";
import CarePackage from "../../asset/CarePackage_Flying.png";
import produce from "immer"

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
    carePackages: {},
    carePackageStatus: {},
    zones: { 'redZone': null, 'poisonGasWarning': null, 'safetyZone': null }
  };

  mapObj = {
    "Miramar": Miramar,
    "Vikendi": Vikendi,
    "Erangel": Erangel,
    "Erangel_Remastered": Erangel_Remastered,
    "Campreturn_Jackal": Campreturn_Jackal,
    "Sanhok": Sanhok
  }

  loadProgressHandler = (loader, resource) => {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
  };

  mapResource = mapName => {
    return this.mapObj[mapName] || mapName;
  };

  calculatePosition = (x) => {
    switch (this.state.mapName) {
      case "Miramar":
        return x / 816;
      case "Vikendi":
        return x / 612;
      case "Erangel":
        return x / 816;
      case "Erangel_Remastered":
        return x / 816;
      case "Campreturn_Jackal":
        return x / 816;
      case "Sanhok":
        return x / 408;
      default:
        return x;
    }
  }

  login = character => {
    const id = character.accountId;

    const newState = produce(this.state, draftState => {
      draftState.players[id] = {};
      draftState.playerStatus = {};
    });

    this.setState(newState);
  };

  create = character => {
    const id = character.accountId;
    const x = this.calculatePosition(character.location.x);
    const y = this.calculatePosition(character.location.y);

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

    const newState = produce(this.state, draftState => {
      draftState.players[id]["pixi"] = {
        circle: circle,
        name: nameText
      };

      draftState.playerStatus[id] = character;
      draftState.survive++;
    });

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

    const x = this.calculatePosition(character.location.x)
    const y = this.calculatePosition(character.location.y)

    this.positionTicker(x, y, id);
    const newState = produce(this.state, draftState => {
      draftState.playerStatus[id] = character;
    });

    this.setState(newState);
  };

  positionTicker = (targetX, targetY, playerId) => {
    const drFunc = x => { if (x) return 1; else return -1; }

    let circleX = this.state.players[playerId]["pixi"].circle.x
    let circleY = this.state.players[playerId]["pixi"].circle.y
    let nameX = this.state.players[playerId]["pixi"].name.x
    let nameY = this.state.players[playerId]["pixi"].name.y

    const circleDx = drFunc(circleX < targetX)
    const circleDy = drFunc(circleY < targetY)
    const nameDx = drFunc(nameX < targetX - 30)
    const nameDy = drFunc(nameY < targetY - 20)

    const positionFunc = () => {
      if (circleDx * (this.state.players[playerId]["pixi"].circle.x - targetX) < 0) {
        this.state.players[playerId]["pixi"].circle.x += circleDx;
      }

      if (circleDy * (this.state.players[playerId]["pixi"].circle.y - targetY) < 0) {
        this.state.players[playerId]["pixi"].circle.y += circleDy;
      }

      if (nameDx * (this.state.players[playerId]["pixi"].name.x - (targetX - 30)) < 0) {
        this.state.players[playerId]["pixi"].name.x += nameDx;
      }

      if (nameDy * (this.state.players[playerId]["pixi"].name.y - (targetY - 20)) < 0) {
        this.state.players[playerId]["pixi"].name.y += nameDy;
      }

      if (~~this.state.players[playerId]["pixi"].circle.x == ~~targetX
        && ~~this.state.players[playerId]["pixi"].circle.y == ~~targetY
        && ~~this.state.players[playerId]["pixi"].name.x == ~~(targetX - 30)
        && ~~this.state.players[playerId]["pixi"].name.y == ~~(targetY - 20)) {

        const newState = produce(this.state, draftState => {
          draftState.players[playerId]["pixi"].circle.x = targetX;
          draftState.players[playerId]["pixi"].circle.y = targetY;
          draftState.players[playerId]["pixi"].name.x = targetX - 30;
          draftState.players[playerId]["pixi"].name.y = targetY - 20;
        })

        this.setState(newState);
        this.state.app.ticker.remove(positionFunc);
      }
    }

    this.state.app.ticker.add(positionFunc);
  }

  manageCarePackage = carePackage => {
    const isGame = carePackage.common.isGame;
    const x = this.calculatePosition(carePackage.itemPackage.location.x)
    const y = this.calculatePosition(carePackage.itemPackage.location.y)
    let newState = undefined;

    if (this.state.carePackages[isGame] === undefined) {
      let packageImage = new PIXI.Sprite.from(CarePackage);
      packageImage.scale.x = 0.3;
      packageImage.scale.y = 0.3;
      packageImage.x = x;
      packageImage.y = y;

      this.state.app.stage.addChild(packageImage);

      newState = produce(this.state, draftState => {
        draftState.carePackages[isGame] = packageImage;
        draftState.carePackageStatus[isGame] = carePackage;
      });
    } else {
      newState = produce(this.state, draftState => {
        draftState.carePackages[isGame].x = x;
        draftState.carePackages[isGame].y = y;
      });
    }

    this.setState(newState);
  };

  drawGameState = (gameState) => {
    const poisonGasWarningPosition = gameState.poisonGasWarningPosition;
    const redZonePosition = gameState.redZonePosition;
    const safetyZonePosition = gameState.safetyZonePosition;

    const x1 = this.calculatePosition(redZonePosition.x)
    const y1 = this.calculatePosition(redZonePosition.y)
    const r1 = this.calculatePosition(gameState.redZoneRadius)

    const x2 = this.calculatePosition(poisonGasWarningPosition.x)
    const y2 = this.calculatePosition(poisonGasWarningPosition.y)
    const r2 = this.calculatePosition(gameState.poisonGasWarningRadius)

    const x3 = this.calculatePosition(safetyZonePosition.x)
    const y3 = this.calculatePosition(safetyZonePosition.y)
    const r3 = this.calculatePosition(gameState.safetyZoneRadius)

    if (this.state.zones['redZone'] != null) {
      this.state.zones['redZone'].clear()
      this.state.zones['redZone'].beginFill(0xff0000, 0.3);
      this.state.zones['redZone'].drawCircle(x1, y1, r1);
    }

    if (this.state.zones['poisonGasWarning'] != null) {
      this.state.zones['poisonGasWarning'].clear()
      this.state.zones['poisonGasWarning'].lineStyle(3, 0xffffff, 1)
      this.state.zones['poisonGasWarning'].drawCircle(x2, y2, r2);
    }

    if (this.state.zones['safetyZone'] != null) {
      this.safetyZoneTicker(x3, y3, r3)
    }
  }

  initPixiGraphics = () => {
    const zone1 = new PIXI.Graphics();
    zone1.beginFill(0xff0000, 0.3);
    zone1.drawCircle(0, 0, 0);
    this.state.app.stage.addChild(zone1);
    this.state.zones['redZone'] = zone1;

    const zone2 = new PIXI.Graphics();
    zone2.lineStyle(3, 0xffffff, 1)
    zone2.drawCircle(0, 0, 0);
    this.state.app.stage.addChild(zone2);
    this.state.zones['poisonGasWarning'] = zone2;

    const zone3 = new PIXI.Graphics();
    zone3.lineStyle(3, 0x0000ff, 1)
    zone3.drawCircle(0, 0, 0);
    this.state.app.stage.addChild(zone3);
    this.state.zones['safetyZone'] = zone3;
  }

  safetyZoneTicker = (x, y, r) => {
    let currR = this.state.zones['safetyZone'].r || r;

    const tickFunc = () => {
      currR--;

      this.state.zones['safetyZone'].clear()
      this.state.zones['safetyZone'].lineStyle(3, 0x0000ff, 1)
      this.state.zones['safetyZone'].drawCircle(x, y, currR);

      if (currR <= r) {
        const nextState = produce(this.state, draftState => {
          draftState.zones['safetyZone'].r = currR;
        });

        this.setState(nextState);
        this.state.app.ticker.remove(tickFunc);
      }
    }

    this.state.app.ticker.add(tickFunc);
  }

  killPlayer = character => {
    const id = character.accountId;

    const newState = produce(this.state, draftState => {
      draftState.survive--;
      draftState.players[id]["pixi"].circle.tint = 0xff0000;
    });

    this.setState(newState);
  }

  setup = () => {
    let camp = new PIXI.Sprite(
      PIXI.loader.resources[`${this.state.mapName}`].texture
    );
    this.state.app.stage.addChild(camp);
    this.initPixiGraphics()

    let timeIdx = 0;

    const startIdx = this.state.replayData.findIndex(
      x => x["_T"] === "LogMatchStart"
    );
    const preArr = this.state.replayData.splice(0, startIdx);

    // replay 시작하기 전에 login 이벤트 처리
    preArr
      .filter(x => x["_T"] === "LogPlayerLogin")
      .forEach(this.login);

    setInterval(() => {
      const x = this.state.replayData[timeIdx];

      switch (x["_T"]) {
        case "LogPlayerPosition":
          this.position(x.character);
          break;

        case "LogMatchStart":
          this.matchStart(x);
          break;

        case "LogCarePackageLand":
        case "LogCarePackageSpawn":
          this.manageCarePackage(x);
          break;

        case "LogGameStatePeriodic":
          this.drawGameState(x.gameState);
          break

        case "LogPlayerKill":
          this.killPlayer(x.victim);
          break;

        default:
          break;
      }

      if (timeIdx < this.state.replayData.length - 1) timeIdx += 1;
      // console.log(`time: ${timeIdx}`);
    }, 4);
  };

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
    if (this.state.playerStatus === null) {
      return (
        <div className="user-list">
          <p>Loading...</p>
        </div>
      );
    }
    return (
      <div>
        <Navigation />
        <div className="survive">SURVIVE | {this.state.survive}</div>
        <div className="carepackage">
          <ul>
            {Object.entries(this.state.carePackageStatus).map(items => {
              return (
                <li key={items[0]}>
                  <b>CarePackage</b>
                  {items[1].itemPackage.items.map(item => {
                    return (
                      <div>
                        {item["category"]} : {item["itemId"]}{" , "}
                        {item["stackCount"]} count
                        </div>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="user-list">
          <ul>
            {Object.entries(this.state.playerStatus)
              .filter(user => user[1].name === this.props.match.params.name)
              .map(user => {
                return (
                  <li key={user[0]}>
                    <div className="searched-user">{user[1].name}</div>
                    <div>Health : {user[1].health.toFixed(2)}</div>
                    <div>
                      location :{" "}
                      {this.calculatePosition(user[1].location.x).toFixed(0)} ,{" "}
                      {this.calculatePosition(user[1].location.y).toFixed(0)}
                    </div>
                  </li>
                );
              })}

            {Object.entries(this.state.playerStatus)
              .filter(user => user[1].name !== this.props.match.params.name)
              .map(user => {
                return (
                  <li key={user[0]}>
                    <div className="other-users">{user[1].name}</div>
                    <div>Health : {user[1].health.toFixed(2)}</div>
                    <div>
                      location :{" "}
                      {this.calculatePosition(user[1].location.x).toFixed(0)} ,{" "}
                      {this.calculatePosition(user[1].location.y).toFixed(0)}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}

export default ReplayPubg;
