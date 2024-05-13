import { createContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import createJson from "../Utilities/Port";
import createJsonShip from "../Utilities/ShipJSON";
export const Cart = createContext();

const Context = ({ children }) => {
	const [portData, setPortData] = useState([]);
	const [ports, setPorts] = useState({});
	const [ships, setShips] = useState({});
	const [timeZone, setTimeZone] = useState([]);
	useEffect(() => {
		const Fetch = async () => {
			try {
				const { data } = await axios.get("http://localhost:5000/portdata");

				const result = await axios.get("http://localhost:5000/shipdata");
				const shipLocation = createJsonShip(result.data.result);

				const responseTimeZone = await axios.get(
					"http://api.timezonedb.com/v2.1/list-time-zone?key=L84TDOCF3C1Q&format=json"
				);

				setTimeZone(responseTimeZone.data.zones);

				const res = createJson(data.port_geo_location);
				setPorts(res);
				setPortData(data.port_geo_location);

				setShips(shipLocation);
			} catch (error) {
				alert("Some error occured! Please check internet and refresh");
				console.log("Some error", error);
			}
		};
		setInterval(async () => {
			try {
				const result = await axios.get("http://localhost:5000/shipdata");
				const shipLocation = createJsonShip(result.data.result);

				setShips(shipLocation);
			} catch (error) {
				alert("Some error occured! Please check internet and refresh");
				console.log("Some error", error);
			}
		}, 1000 * 60);

		Fetch();
	}, []);

	return (
		<Cart.Provider value={{ portData, ports, ships, timeZone }}>
			{children}
		</Cart.Provider>
	);
};

export default Context;
