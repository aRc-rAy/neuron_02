import React, { useContext } from "react";
import { Cart } from "../../Context/Context";
import Timer from "./timer";
import "./timeZone.css";

const TimeZones = () => {
  const { timeZone } = useContext(Cart);

  return (
    <div className="timeZone">
      {timeZone?.map((zone) => (
        <div key={zone?.zoneName} className="zones">
          <h4>{zone?.zoneName}</h4>
          <Timer zone={zone.zoneName} />
        </div>
      ))}
    </div>
  );
};

export default TimeZones;
