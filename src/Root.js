import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import App from "./App";
import Lol from "./components/Lol";
import Pubg from "./components/Pubg";
import About from "./components/About";
import Matchlist from "./components/Pubg/Matchlist";
import ReplayPubg from "./components/Pubg/Replay";

const Root = () => {
  return (
    <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />
        <Route path="/lol" component={Lol} />
        <Route exact path="/pubg" component={Pubg} />
        <Route exact path="/pubg/:name/:platform" component={Matchlist} />
        <Route path="/pubg/:name/:platform/:matchId" component={ReplayPubg} />
    </Switch>
    </BrowserRouter>
  );
};

export default Root;
