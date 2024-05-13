const express = require("express");
const app = express();
const fs = express("fs");
const exceltoJson = require("convert-excel-to-json");
const cors = require("cors");
const { getMinutes, modifyJsonObject } = require("./Functions/getKeyString.js");
app.use(cors());

const result = exceltoJson({
  sourceFile: "./port_geo_location.xlsx",
  columnToKey: {
    A: "portname",
    B: "latitude",
    C: "longitude",
  },
});

const ships = exceltoJson({
  sourceFile: "./geo_stats_data_7_days.xlsx",
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

const dat = new Date();
console.log(getMinutes(dat));

console.log(modifiedJson);

app.get("/shipdata", (req, res) => {
  const currentDate = new Date();
  const minute = getMinutes(currentDate);

  const array = [];
  console.log(minute);
  modifiedJson.geo_stats.forEach((element) => {
    if (element.minutes === minute) {
      console.log(element);
      array.push(element);
    }
  });

  res.status(200).json({ result: array });
});

app.get("/portdata", (req, res) => {
  res.status(200).json(result);
});

app.listen(4000, () => {
  console.log("Server is runnig 😍😎");
});
