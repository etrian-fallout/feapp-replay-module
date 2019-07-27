import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <NavLink to="/about">About</NavLink>
    </div>
  );
};

export default Navigation;