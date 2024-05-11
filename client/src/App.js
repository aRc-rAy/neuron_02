import { useEffect, useState } from "react";
import "./App.css";
import Map from "./Components/Map/Map";
import axios from "axios";

function App() {
  return (
    <div className="main">
      {/* <div className="top"></div> */}
      <div className="middle">
        <Map />
      </div>
      {/* <div className="bottom">
			</div> */}
    </div>
  );
}

export default App;
