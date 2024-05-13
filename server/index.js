const express = require("express");
const app = express();
const fs = express("fs");
const exceltoJson = require("convert-excel-to-json");
const cors = require("cors");
const { getMinutes, modifyJsonObject } = require("./Functions/getKeyString.js");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());

const result = exceltoJson({
	sourceFile:
		"https://github.com/aRc-rAy/neuron_02/blob/main/server/port_geo_location.xlsx",
	columnToKey: {
		A: "portname",
		B: "latitude",
		C: "longitude",
	},
});

const ships = exceltoJson({
	sourceFile:
		"https://github.com/aRc-rAy/neuron_02/blob/main/server/port_geo_location.xlsx",
	columnToKey: {
		A: "ship_name",
		B: "latitude",
		C: "longitude",
		D: "heading",
		E: "timestamp",
	},
});

const convertDateToMinutes = (value) =>
	Math.floor(
		(new Date(value).getTime() - new Date("2024-04-28 19:38:00.000 +0530")) /
			(60 * 1000)
	);

const modifiedJson = modifyJsonObject(
	ships,
	"timestamp",
	"minutes",
	convertDateToMinutes
);

// -============== Deploy ======================
let __dirname1 = path.resolve();

let pathSegments = path.dirname(__dirname1).split(path.sep);
__dirname1 = path.join(...pathSegments);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname1, "/frontend/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname1, "frontend/build/index.html"));
	});
} else {
	app.listen(5000, () => {
		console.log("Server is runnig 😍😎");
	});
}

// =============== Deploy -=====================

app.get("/shipdata", (req, res) => {
	const currentDate = new Date();
	const minute = getMinutes(currentDate);
	const array = [];
	// console.log(minute);
	modifiedJson.geo_stats.forEach((element) => {
		if (element.minutes === minute) {
			// console.log(element);
			array.push(element);
		}
	});

	res.status(200).json({ result: array });
});

app.get("/portdata", (req, res) => {
	res.status(200).json(result);
});
