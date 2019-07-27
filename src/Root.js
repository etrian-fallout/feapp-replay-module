import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Route } from "react-router-dom";
import Lol from "./components/Lol";
import Pubg from "./components/Pubg";
import About from "./components/About";

const Root = () => {
  return (
    <BrowserRouter><switch>
    <Route exact path="/" component={App} />
    <Route path="/about" component={About} />
    <Route path="/lol/" component={Lol} />
    <Route path="/pubg" component={Pubg} />
  </switch>
    </BrowserRouter>
  );
};

export default Root;
