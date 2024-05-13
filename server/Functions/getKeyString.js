const getMinutes = (currentDate) => {
  const oldDate = new Date("2024-04-28 19:38:00.000 +0530");
  const oldSeconds = oldDate.getTime();

  const currentSeconds = currentDate.getTime();

  let totalMilliseconds = currentSeconds - oldSeconds;
  console.log(totalMilliseconds);
  totalMilliseconds = Math.floor(totalMilliseconds / 1000);
  totalMilliseconds = Math.floor(totalMilliseconds / 60);
  totalMilliseconds = Math.floor(totalMilliseconds / 60);
  console.log(totalMilliseconds);

  const totalMinutesInAWeek = 7 * 24 * 60;
  console.log(totalMinutesInAWeek);

  const currentMinute = totalMilliseconds % totalMinutesInAWeek;
  return currentMinute;
};

function modifyJsonObject(
  jsonObject,
  propertyToTake,
  newPropertyName,
  transformValueFn = (value) => value
) {
  const modifiedJsonObject = JSON.parse(JSON.stringify(jsonObject));
  modifiedJsonObject.geo_stats.forEach((obj) => {
    const value = obj[propertyToTake];
    const transformedValue = transformValueFn(value);
    obj[newPropertyName] = transformedValue;
  });

  return modifiedJsonObject;
}

module.exports = { getMinutes, modifyJsonObject };
