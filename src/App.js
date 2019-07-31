import React from "react";
import Navigation from "./Navigation";
import GameNavigation from "./GameNavigation";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PUBG <del>/ LOL</del> Minimap Replay</h1>
      </header>
      <Navigation />
      <GameNavigation />
      
    </div>
  );
}

export default App;
