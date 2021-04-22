import React, { useEffect, useState } from "react";
import WifiIcon from "./WifiIcon";
import "./App.css";
import Ripple from "react-material-ripple";

const LOCAL = true;

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
      ssid: "Burgess Home Outside",
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
      ssid: "Kevfi_5G",
      untrusted: false,
    },
    {
      bandwidth: "80",
      capabilities: ["WPA2-PSK-CCMP", "RSN-PSK-CCMP", "ESS"],
      channel: -1,
      connected: false,
      distanceCm: -1,
      distanceErrorCm: -1,
      frequency: 5180,
      level: -70,
      mac: "94:6a:77:11:0f:3d",
      seen: 1619123030940,
      ssid: "",
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
      ssid: "Burgess Home 5.0",
      untrusted: false,
    },
    {
      bandwidth: "80",
      capabilities: [
        "WPA2-EAP-CCMP+TKIP",
        "RSN-EAP-CCMP+TKIP",
        "WPA-EAP-CCMP+TKIP",
        "ESS",
      ],
      channel: -1,
      connected: false,
      distanceCm: -1,
      distanceErrorCm: -1,
      frequency: 5180,
      level: -71,
      mac: "94:6a:77:11:0f:41",
      seen: 1619123030940,
      ssid: "",
      untrusted: false,
    },
    {
      bandwidth: "20",
      capabilities: ["ESS"],
      channel: 1,
      connected: false,
      distanceCm: -1,
      distanceErrorCm: -1,
      frequency: 2412,
      level: -73,
      mac: "fa:8f:ca:7c:5e:24",
      seen: 1619123030941,
      ssid: "Dining Room speaker.ynm",
      untrusted: false,
    },
  ],
};

const sortWifi = (a, b) => {
  const aTrusted = a.untrusted === false;
  const bTrusted = b.untrusted === false;
  const aBandwidth = a.bandwidth ? parseInt(a.bandwidth) : 0;
  const bBandwidth = b.bandwidth ? parseInt(b.bandwidth) : 0;

  if (a.connected) {
    return -1;
  }

  if (b.connected) {
    return 1;
  }

  if (aTrusted && !bTrusted) {
    return -1;
  }

  if (!aTrusted && bTrusted) {
    return 1;
  }

  if (aBandwidth > bBandwidth) {
    return -1;
  }

  if (aBandwidth < bBandwidth) {
    return 1;
  }

  if (aBandwidth === bBandwidth) {
    return 0;
  }
};

function App() {
  const [wifiNetworks, setWifiNetworks] = useState([]);

  useEffect(() => {
    if (LOCAL) {
      return setWifiNetworks(mockWifi.wifis.sort(sortWifi));
    }

    //Get from tasker
  }, []);

  return (
    <>
      <div className="tasker-quick-wifi">
        {wifiNetworks.map((w, idx) => (
          <Ripple key={`${w.ssid} + ${w.bandwidth} + ${w.frequency} + ${idx}`} className="tasker-quick-wifi__network-ripple">
            <div
              className={[
                "tasker-quick-wifi__network",
                w.connected ? "tasker-quick-wifi__network-connected" : "",
              ].join(" ")}
            >
              <div className="tasker-quick-wifi__network-icon">
                <WifiIcon height={24} width={24} />
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
