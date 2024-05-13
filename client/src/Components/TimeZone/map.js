import React, { useState, useEffect, useContext } from "react";
import mapboxgl from "mapbox-gl";
import moment from "moment-timezone";
import axios from "axios";
import { Cart } from "../../Context/Context";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw";

const mapboxAccessToken = `pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw`;

const TimeMap = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const { timeZone } = useContext(Cart);

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-v9",
        center: [-102.46891, 28.60645],
        zoom: 5,
      });

      setMap(map);
    };

    initializeMap();

    return () => map && map.remove();
  }, []);

  useEffect(() => {
    if (!map) return;

    const updateTimeForMarkers = () => {
      markers?.forEach((marker) => {
        if (moment().tz(marker.timezone)) {
          const time = moment().tz(marker.timezone)?.format("h:mm A");
          marker.element.innerHTML = `<div style="color:white; border:1px solid yellow"><span>${time}</span><br/><span>${marker.timezone}</span></div>`;
        }
      });
    };

    const addTimeZonesMarkers = () => {
      const timeZones = timeZone?.map((tz) => tz.zoneName);

      const newMarkers = timeZones?.map(async (timezone) => {
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${timezone}.json?access_token=${mapboxAccessToken}`
          );

          let coordinates = null;

          let rel = 0;
          for (let cnt of response.data.features) {
            if (cnt.relevance > rel) {
              rel = cnt.relevence;
              coordinates = cnt.center;
            }
          }

          if (!coordinates) return;

          const el = document.createElement("div");
          el.className = "marker";

          const marker = new mapboxgl.Marker(el)
            .setLngLat(coordinates)
            .addTo(map);

          const time = moment().tz(timezone).format("h:mm A");

          el.innerHTML = `<div style="color:white; border:1px solid yellow"><span>${time}</span><br/><span>${timezone}</span></div>`;

          return {
            timezone,
            element: el,
            marker,
          };
        } catch (error) {
          console.log("error at zone", error);
        }
      });

      setMarkers(newMarkers);
    };

    addTimeZonesMarkers();

    const interval = setInterval(updateTimeForMarkers, 1000);

    return () => clearInterval(interval);
  }, [map, timeZone]);
  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default TimeMap;
