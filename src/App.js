import React, { useEffect, useState } from "react";
import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg.png";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Markerposition from "./components/Markerposition";

function App() {
  const [address, setAddress] = useState();
  const [ipAddress, setIpAddress] = useState("");

  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=8.8.8.8`
        );
        const data = await res.json();
        console.log(data);
        setAddress(data);
      };

      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  const getEnteredData = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${
        process.env.REACT_APP_API_KEY
      }&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredData();
    setIpAddress("");
  };

  return (
    <>
      <div className="App background w-full h-full">
        <div className="absolute w-full -z-10">
          <img src={background} alt="" className="w-screen h-80" />
        </div>

        <div className="max-w-xl mx-auto p-8">
          <h1 className="font-bold text-2xl lg:text-3xl text-white pb-8 text-center">
            IP Address Tracker
          </h1>

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="w-full flex"
          >
            <input
              type="text"
              name="ipaddress"
              id="ipaddress"
              placeholder="Search for any IP address or domain"
              className="w-full py-2 px-4 rounded-l-lg outline-none"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button type="submit" className="bg-black py-2 px-4 rounded-r-lg">
              <img src={arrow} alt="" />
            </button>
          </form>
        </div>

        {address && (
          <div
            className=" bg-white text-center md:text-left rounded-lg shadow p-8 mx-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl lg:mx-auto lg:-mb-16 -mb-16 relative"
            style={{ zIndex: 1000 }}
          >
            <div className=" lg:border-r lg:border-r-slate-400">
              <h2 className=" uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                IP Address
              </h2>
              <p className=" font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                {address.ip}
              </p>
            </div>

            <div className=" lg:border-r lg:border-r-slate-400">
              <h2 className=" uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                Location
              </h2>
              <p className=" font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                {address.location.country}, {address.location.region}
              </p>
            </div>

            <div className=" lg:border-r lg:border-r-slate-400">
              <h2 className=" uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                TIMezone
              </h2>
              <p className=" font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                UTC {address.location.timezone}
              </p>
            </div>

            <div className="">
              <h2 className=" uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                IsP
              </h2>
              <p className=" font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                {address.isp}
              </p>
            </div>
          </div>
        )}
      </div>
      {address && (
        <MapContainer
          center={[address.location.lat, address.location.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100vh", width: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Markerposition address={address} />
        </MapContainer>
      )}
    </>
  );
}

export default App;
