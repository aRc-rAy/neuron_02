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

import { Cart } from "../../Context/Context.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw";

const Map = () => {
  const { ports, ships } = useContext(Cart);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(1.7);
  const [time, setTime] = useState(new Date());
  const [style, setStyle] = useState(
    "mapbox://styles/mapbox/navigation-night-v1"
  );

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      center: [lng, lat],
      projection: "globe",
      zoom: zoom,
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

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
      });

      map.current.on("mouseleave", "points", () => {
        map.current.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    const secondsPerRevolution = 120;
    const maxSpinZoom = 2;
    const slowSpinZoom = 3;

    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 500, easing: (n) => n });
      }
    }

    map.current.on("mousedown", () => {
      userInteracting = true;
    });

    map.current.on("mouseup", () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on("dragend", () => {
      userInteracting = false;
      spinGlobe();
    });
    map.current.on("pitchend", () => {
      userInteracting = false;
      spinGlobe();
    });
    map.current.on("rotateend", () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on("moveend", () => {
      spinGlobe();
    });

    spinGlobe();

    const intervalId = setInterval(() => {
      const hour = time.getHours();
      const minute = time.getMinutes();
      const seconds = time.getSeconds();
      const timeOfDay = (hour + minute / 60 + seconds / 3600) / 24;

      if (timeOfDay < 0.25 || timeOfDay > 0.75) {
        setStyle("mapbox://styles/mapbox/navigation-night-v1");
      } else {
        setStyle("mapbox://styles/mapbox/navigation-day-v1");
      }
      setTime(new Date());
    }, 1000);

    return () => {
      map.current?.remove();
      clearInterval(intervalId);
    };
  }, [ports, style]);

  useEffect(() => {
    if (!map.current) return;
    map.current.on("style.load", () => {
      map.current.setFog({});

      map.current.addSource("ships", {
        type: "geojson",
        data: ships,
      });

      map.current.addLayer({
        id: "ships",
        type: "circle",
        source: "ships",
        paint: {
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-color": "yellow",
          "circle-stroke-color": "black",
        },
      });
      map.current.addLayer({
        id: "ships2",
        type: "symbol",
        source: "ships",
        layout: {
          "icon-image": "flight",
          "text-field": ["get", "title"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [-2.5, -1],
          "text-anchor": "top",
        },
      });
    });

    map.current.on("load", () => {
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.current.on("mouseenter", "ships", (e) => {
        map.current.getCanvas().style.cursor = "pointer";

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
      });

      map.current.on("mouseleave", "ships", () => {
        map.current.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    return () => {};
  }, [ships, style]);

  return <div ref={mapContainer} id="map" className="mapboxgl-map"></div>;
};

export default Map;
