import React from "react";
import { Stage, Sprite, Graphics } from "@inlet/react-pixi"

class ReplayPubg extends React.Component {
  state = {
    matchId: "",
    mapName: "",
    telemetryUrl: ""
  };

  drawCircle = () => (
    <Graphics
      draw={
        g => {
          g.lineStyle(0)
          g.beginFill(0xffff0b, 0.5)
          g.drawCircle(470, 90, 60)
          g.endFill()
        }
      }
    />
  )

  async componentDidMount() {
    await this.setState({
      matchId: this.props.match.params.matchId,
      mapName: this.props.location.state.mapName,
      telemetryUrl: this.props.location.state.telemetryUrl
    });

    console.log(this.state);

    const data = await fetch(
      this.state.telemetryUrl, {
        // "http://localhost:3000/mm.json", {
        method: 'get',
        headers: new Headers({
          "Accept": "application/vnd.api+json",
          "Accept-Encoding": "gzip"
        })
      }).then(res => res.json())

    console.log(data)
  }

  render() {
    return <div>
      <div>{this.state.matchId}</div>
      <Stage width={1000} height={1000} options={{
        backgroundColor: 0x1099bb,
        antialias: true,
        transparent: false,
        resolution: 1
      }}>

        <Sprite image={`http://localhost:3000/asset/${this.state.mapName}_Main_Low_Res.png`} x={0} y={0} />

      </Stage>
    </div>;
  }
}

export default ReplayPubg;
