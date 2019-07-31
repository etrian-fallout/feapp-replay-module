import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import App from "./App";
import Lol from "./components/Lol";
import LolMatchlist from './components/Lol/Matchlist'
import LolReplay from './components/Lol/Replay'
import Pubg from "./components/Pubg";
import About from "./components/About";
import PubgMatchlist from "./components/Pubg/Matchlist";
import PubgReplay from "./components/Pubg/Replay";

const Root = () => {
  return (
    <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />
        <Route exact path="/lol" component={Lol} />
        <Route exact path="/lol/:name" component={LolMatchlist} />
        <Route path ="/lol/:name/:matchId" component={LolReplay} />
        <Route exact path="/pubg" component={Pubg} />
        <Route exact path="/pubg/:name/:platform" component={PubgMatchlist} />
        <Route path="/pubg/:name/:platform/:matchId" component={PubgReplay} />
    </Switch>
    </BrowserRouter>
  );
};

export default Root;
