import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useContext,
} from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./Map.css";

import createJson from "../../Utilities/Port.js";
import { Cart } from "../../Context/Context.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw";

const Map = () => {
  const { ports } = useContext(Cart);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("style.load", () => {
      map.current.addSource("points", {
        type: "geojson",
        data: ports,
      });

      map.current.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-color": " #DF3C5F",
          "circle-stroke-color": "black",
        },
      });
    });

    map.current.on("load", () => {
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.current.on("mouseenter", "points", (e) => {
        map.current.getCanvas().style.cursor = "pointer";

        // console.log(e);
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        console.log(description);

        console.log(coordinates);

        console.log(e.lngLat.lng);
        console.log(e.lngLat.lat);
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        console.log(coordinates);

        popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
      });

      map.current.on("mouseleave", "points", () => {
        map.current.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    return () => {
      map.current.remove();
    };
  }, [ports]);

  return <div ref={mapContainer} id="map" className="mapboxgl-map"></div>;
};

export default Map;
