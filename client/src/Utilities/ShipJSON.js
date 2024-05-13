const createJsonShip = (data) => {
  const ships = data?.map((ship) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [ship?.longitude, ship?.latitude],
      },
      properties: {
        description: `${ship?.ship_name} <br/> Heading to:${ship?.heading} `,
        title: ship?.ship_name,
      },
    };
  });

  return { type: "FeatureCollection", features: ships };
};

export default createJsonShip;
