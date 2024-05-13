const createJson = (data) => {
  const ports = data?.map((port) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [port?.longitude, port?.latitude],
      },
      properties: {
        description: `<p> Port name: ${port?.portname}</p>`,
      },
    };
  });
  return { type: "FeatureCollection", features: ports };
};

export default createJson;
