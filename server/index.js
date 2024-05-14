const express = require("express");
const app = express();
const cors = require("cors");
const { getMinutes, modifyJsonObject } = require("./Functions/getKeyString.js");
const excelToJson = require("convert-excel-to-json");
const path = require("path");
const dotenv = require("dotenv");
const result = require("./port_geo_location.json");

dotenv.config();
app.use(cors());

result.forEach((port) => {
	port["portname"] = port["port_name"];
	port["latitude"] = port["geo_location_latitude"];
	port["longitude"] = port["geo_location_longitude"];
	delete port["port_name"];
	delete port["geo_location_latitude"];
	delete port["geo_location_longitude"];
});

// const ships = excelToJson({
// 	sourceFile: "./geo_stats_data_7_days.xlsx",
// 	columnToKey: {
// 		A: "ship_name",
// 		B: "latitude",
// 		C: "longitude",
// 		D: "heading",
// 		E: "timestamp",
// 	},
// });

const convertDateToMinutes = (value) =>
	Math.floor(
		(new Date(value).getTime() - new Date("2024-04-28 19:38:00.000 +0530")) /
			(60 * 1000)
	);

// const modifiedJson = modifyJsonObject(
// 	ships,
// 	"timestamp",
// 	"minutes",
// 	convertDateToMinutes
// );

// console.log(modifiedJson);

// -============== Deploy ======================
const dirname1 = path.resolve();
const pathArray = dirname1.split("\\");
pathArray.pop();
const newDirName = path.join(...pathArray);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(newDirName, "client", "build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(newDirName, "client", "build", "index.html"));
	});

	console.log("app is running");
} else {
	app.get("*", "Things going out of hand...Please wait");
}

// =============== Deploy -=====================

app.get("/shipdata", (req, res) => {
	const currentDate = new Date();
	const minute = getMinutes(currentDate);
	const array = [];

	// modifiedJson.geo_stats.forEach((element) => {
	// 	if (element.minutes === minute) {
	// 		array.push(element);
	// 	}
	// });

	res.status(200).json({ result: array });
});

app.get("/portdata", (req, res) => {
	res.status(200).json(result);
});

app.listen(5000, () => {
	console.log("Server is running 😍😎");
});
