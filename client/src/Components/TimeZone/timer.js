import React, { useEffect, useState } from "react";

const Timer = ({ zone }) => {
  const [time, setTime] = useState(Date.now());

  const [show, setShow] = useState("");

  function convertMillisecsToTimezone(milliseconds, zone) {
    const date = new Date(milliseconds);

    const formatter = new Intl.DateTimeFormat([], {
      timeZone: zone,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const formattedTime = formatter.format(date);
    return formattedTime;
  }

  useEffect(() => {
    const updater = setInterval(() => {
      setTime((prev) => Date.now());
    }, 1000);

    return () => {
      clearInterval(updater);
    };
  }, []);

  useEffect(() => {
    const formattedTime = convertMillisecsToTimezone(time, zone);
    setShow(String(formattedTime));
  }, [time]);

  return <div>{show}</div>;
};

export default Timer;
