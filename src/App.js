import React, { useEffect, useState } from "react";
import WifiIcon from "./WifiIcon";
import NoWifi from "./NoWifi";
import Ripple from "react-material-ripple";
import "./App.css";

const LOCAL = process.env.NODE_ENV === "development";

const mockWifi = {
  wifis: [
    {
      bandwidth: "20",
      capabilities: ["WPA2-PSK-CCMP", "RSN-PSK-CCMP", "ESS", "WPS"],
      channel: 11,
      connected: false,
      distanceCm: -1,
      distanceErrorCm: -1,
      frequency: 2462,
      level: -49,
      mac: "dc:ef:09:dd:e4:92",
      seen: 1619123030939,
      ssid: "Home Outside",
      untrusted: false,
    },
    {
      bandwidth: "80",
      capabilities: [
        "WPA-PSK-TKIP+CCMP",
        "WPA2-PSK-TKIP+CCMP",
        "RSN-PSK-TKIP+CCMP",
        "ESS",
        "WPS",
      ],
      channel: -1,
      connected: false,
      distanceCm: -1,
      distanceErrorCm: -1,
      frequency: 5200,
      level: -67,
      mac: "b0:df:c1:43:b2:c5",
      seen: 1619123030940,
      ssid: "Kev_5G",
      untrusted: false,
    },
    {
      bandwidth: "80",
      capabilities: ["WPA2-PSK-CCMP", "RSN-PSK-CCMP", "ESS", "WPS"],
      channel: -1,
      connected: true,
      distanceCm: -1,
      distanceErrorCm: -1,
      frequency: 5180,
      level: -71,
      mac: "94:6a:77:11:0f:3c",
      seen: 1619123030939,
      ssid: "Home 5.0",
      untrusted: false,
    },
    {
      bandwidth: "0",
      capabilities: ["ESS"],
      channel: 1,
      connected: false,
      distanceCm: -1,
      distanceErrorCm: -1,
      frequency: 2412,
      level: -73,
      mac: "fa:8f:ca:7c:5e:24",
      seen: 1619123030941,
      ssid: "Dining Room",
      untrusted: false,
    },
  ],
};

const sortWifi = (a, b) => {
  const aTrusted = a.untrusted === false;
  const bTrusted = b.untrusted === false;
  const aBandwidth = a.bandwidth ? parseInt(a.bandwidth) : 0;
  const bBandwidth = b.bandwidth ? parseInt(b.bandwidth) : 0;

  //Connected at the top
  if (a.connected) return -1;
  else if (b.connected) return 1;

  //Sort first by Saved
  if (aTrusted && !bTrusted) return -1;
  else if (!aTrusted && bTrusted) return 1;

  //Then by bandwidth
  if (aBandwidth === bBandwidth) return 0;
  if (aBandwidth < bBandwidth) return 1;

  return -1;
};

function App() {
  const [wifiNetworks, setWifiNetworks] = useState([]);

  /*eslint-disable no-undef*/
  useEffect(() => {
    AutoTools.setDefault("networks", { wifis: [] });
    
    if (LOCAL) {
      return setWifiNetworks(mockWifi.wifis.sort(sortWifi));
    }else{
      AutoTools.setSize("350", "420");
    }

    window.checkInterval = setInterval(() => {
      if (getNetworks) {
        clearInterval(window.checkInterval);
        setWifiNetworks(getNetworks().wifis.sort(sortWifi));
      }
    }, 50);
  }, []);

  //Im trying to see how to access the networks variable sent from Tasker properly
  const postLog = (log) => {
    const url = "/log-tasker";

    const response = fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    });
  };

  const connectToNetwork = (network) => {
    postLog({
      log: {
        isSet: AutoTools.isSet("networks"),
        networks: networks,
        windowNetworks: window.networks,
        AutoToolsfieldToObject: AutoTools.fieldsToObject("networks"),
      },
    });
    if(!LOCAL){
      AutoTools.sendCommand(network.ssid);
      AutoTools.hapticFeedback();
    }
  };
  /*eslint-disable no-undef*/

  return (
    <>
      <div
        className={[
          "tasker-quick-wifi",
          wifiNetworks.length === 0 ? "--empty" : "",
        ].join(" ")}
      >
        {(!wifiNetworks || wifiNetworks.length === 0) && (
          <div className={["tasker-quick-wifi__network"].join(" ")}>
            <div className="tasker-quick-wifi__network-name --empty">
              <p>{"No Networks Available"}</p>
              <p style={{marginBottom: 12}}>Check tasker for issues</p>
              <NoWifi height={34} width={34}/>
            </div>
          </div>
        )}
        {wifiNetworks.map((w, idx) => (
          <Ripple
            key={`${w.ssid} + ${w.bandwidth} + ${w.frequency} + ${idx}`}
            className="tasker-quick-wifi__network-ripple"
          >
            <div
              onClick={() => connectToNetwork(w)}
              className={[
                "tasker-quick-wifi__network",
                w.connected ? "tasker-quick-wifi__network-connected" : "",
              ].join(" ")}
            >
              <div className="tasker-quick-wifi__network-icon">
                <WifiIcon />
                <div
                  className="tasker-quick-wifi__network-icon-strength"
                  style={{
                    transform: `scale(${w.bandwidth / 100}) ${
                      w.bandwidth <= 20 ? "translateY(15px)" : ""
                    }`,
                  }}
                >
                  <WifiIcon />
                </div>
              </div>
              <div className="tasker-quick-wifi__network-name">
                <p>{w.ssid || "No SSID"}</p>
                {w.connected ? (
                  <p>Connected</p>
                ) : w.untrusted === false ? (
                  <p>Saved</p>
                ) : (
                  <React.Fragment />
                )}
              </div>
            </div>
          </Ripple>
        ))}
      </div>
    </>
  );
}

export default App;
