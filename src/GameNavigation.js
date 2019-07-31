import React from "react";
import { NavLink } from "react-router-dom";

const GameNavigation = () => {
  return (
    <div>
      <NavLink to="pubg">PLAYERUNKNOWN'S BATTLEGROUND</NavLink>
      {/* <NavLink to="lol">League of Legends</NavLink> */}
    </div>
  );
};
export default GameNavigation;
