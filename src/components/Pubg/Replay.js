import React from "react";
import * as PIXI from "pixi.js";

class ReplayPubg extends React.Component {
  state = {
    matchId: "",
    mapName: "",
    telemetryUrl: "",
    replayData: null,
    app: null,
    players: {}
  };

  loadProgressHandler = (loader, resource) => {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
  }

  login = (character) => {
    const id = character.accountId;
    this.state.players[id] = {};
  }

  create = (character) => {
    const id = character.accountId;
    const x = character.location.x / 816;
    const y = character.location.y / 816;

    let circle = new PIXI.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(0, 0, 10);
    circle.x = x;
    circle.y = y;

    this.state.app.stage.addChild(circle);
    this.state.players[id]['pixi'] = circle;
  }

  matchStart = (matchData) => {
    const characters = matchData.characters;

    characters.forEach(character => {
      this.create(character);
    })
  }

  position = (character) => {
    const id = character.accountId;

    if (this.state.players[id]['pixi'] == undefined) {
      return;
    }

    const x = character.location.x / 816;
    const y = character.location.y / 816;

    this.state.players[id]['pixi'].x = x
    this.state.players[id]['pixi'].y = y
  }

  setup = () => {
    let camp = new PIXI.Sprite(PIXI.loader.resources[`${this.state.mapName}`].texture);
    this.state.app.stage.addChild(camp);

    let timeIdx = 0;

    const startIdx = this.state.replayData.findIndex(x => x['_T'] == 'LogMatchStart');
    const preArr = this.state.replayData.splice(0, startIdx)

    // replay 시작하기 전에 login 이벤트 처리
    preArr.filter(x => x['_T'] == 'LogPlayerLogin')
      .forEach(x => this.login(x));

    let playInterval = setInterval(() => {
      const x = this.state.replayData[timeIdx];

      switch (x['_T']) {
        case "LogPlayerLogin":
          this.login(x);
          break;

        case "LogPlayerPosition":
          this.position(x.character)
          break

        case "LogMatchStart":
          this.matchStart(x);
          break

        default:
          break;
      }

      timeIdx += 1
      console.log(`time: ${timeIdx}`)
    }, 2);
  };

  async componentDidMount() {
    const app = new PIXI.Application({
      width: 1000,
      height: 1000,
      backgroundColor: 0x000000,
      view: document.getElementById('container')
    })

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
    })

    PIXI.loader
      .add(`${this.state.mapName}`, `http://localhost:3000/asset/${this.state.mapName}_Main_Low_Res.png`)
      .on('progress', this.loadProgressHandler)
      .load(this.setup);
  }

  render() {
    return (
      <div>Replay</div>
    );
  }
}

export default ReplayPubg;
