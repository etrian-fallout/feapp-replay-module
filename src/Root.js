import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import App from "./App";
import Lol from "./components/Lol";
import Pubg from "./components/Pubg";
import About from "./components/About";

const Root = () => {
  return (
    <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />
        <Route path="/lol/" component={Lol} />
        <Route path="/pubg" component={Pubg} />
    </Switch>
    </BrowserRouter>
  );
};

export default Root;
