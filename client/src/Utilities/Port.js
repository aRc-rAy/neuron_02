const createJson = (data) => {
  console.log("data", data);
  const ports = data?.map((port) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [port?.longitude, port?.latitude],
      },
      properties: {
        description: `<p>${port?.portname}</p>`,
      },
    };
  });
  return { type: "FeatureCollection", features: ports };
};

export default createJson;
