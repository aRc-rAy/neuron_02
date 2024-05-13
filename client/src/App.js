import { useState } from "react";
import "./App.css";
import Map from "./Components/Map/Map";
import TimeZones from "./Components/TimeZone/timeZone";
import TimeMap from "./Components/TimeZone/map";

function App() {
	const [showtime, setShowTime] = useState(false);
	return (
		<div className="main">
			<div className="leftSide">
				<div className="zoneHead">
					<h2>Time Zones</h2>
					<h2>Time</h2>
				</div>
				<TimeZones />
			</div>
			<div className="middle">
				{showtime && <TimeMap />}
				{!showtime && <Map />}
				<button
					id="show-btn"
					onClick={() => {
						setShowTime((pre) => !pre);
					}}
				>
					Show {showtime ? "Map" : "Time"}
				</button>
			</div>
		</div>
	);
}

export default App;
