import { createContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import createJson from "../Utilities/Port";
export const Cart = createContext();

const Context = ({ children }) => {
  const [portData, setPortData] = useState([]);
  const [ports, setPorts] = useState({});
  useEffect(() => {
    const Fetch = async () => {
      const { data } = await axios.get("http://localhost:4000/portdata");
      setPortData(data.port_geo_location);
      console.log(data);
      const res = createJson(data.port_geo_location);
      setPorts(res);
    };

    Fetch();
  }, []);
  // console.log("portData",portData)
  // console.log("port",ports)

  return <Cart.Provider value={{ portData, ports }}>{children}</Cart.Provider>;
};

export default Context;
