import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { string } from "../locales";
import Header, { HelpText, MoreInfo } from "../componenets/Header";
import { useHistory } from "react-router-dom";
import { IStore } from "../stores/InstantStore";
import { error } from "../functions/toast";
import { Spin } from "antd";
import { Params } from "../constants/Params";
const { ipcRenderer } = require("electron");

const SelectDevice = () => {
  const ble = IStore.ble;
  const history = useHistory();
  const param = Params();

  const [devices, setDevices] = useState([]);
  const [isSearchStarted, setIsSearchStarted] = useState(false);

  useEffect(() => {}, []);

  function scan() {
    setIsSearchStarted(true);
    navigator.bluetooth
      .requestDevice({
        filters: [{ namePrefix: "ALRF" }],
        optionalServices: ["2456e1b9-26e2-8f83-e744-f34f01e9d701"],
      })
      .then((device) => {
        device.gatt
          .connect()
          .then((service) => {
            IStore.setLoading(false);
            ble.setDevice(service);
            ble.startListener();

            IStore.navigation = history;

            ble.sendDataToDevice(
              param.kimlikdogrulama.title,
              param.kimlikdogrulama.getHex
            );
          })
          .catch((e) => {
            IStore.setLoading(false);
            setDevices([]);
            // console.warn(e);
            error(
              string["baglantihatasi"],
              string["baglantibasarisizaciklama"]
            );
          });
      });

    ipcRenderer.on("devices", (event, deviceList) => {
      if (Array.isArray(deviceList) && deviceList.length) {
        setIsSearchStarted(false);
        setDevices([...deviceList]);
      }
    });
  }

  return (
    <div className="center contain column">
      <div className="center" style={{ width: "100%" }}>
        <Header
          title="Cihazlar"
          onBack={() => {
            history.goBack();
          }}
        />
      </div>
      {/*<div
        className="button"
        onClick={() => {
          IStore.setLoading(false);
          ble.setDevice("test");
          history.goBack();
        }}
        style={{ alignSelf: "center" }}
      >
        Demo Verileri Kullan
      </div>*/}

      <div
        className={"flex contain column scroll"}
        style={{ backgroundColor: Colors.darkGray }}
      >
        {devices.length ? (
          <div className="scroll flex column" style={{ alignItems: "center" }}>
            {devices.map(({ deviceId, deviceName }, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    IStore.setLoading(true);
                    ipcRenderer.send("selected-device", deviceId);
                  }}
                  className="button"
                  style={{
                    marginTop: "3vh",
                  }}
                >
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "3vh",
                      color: Colors.white,
                    }}
                  >
                    {deviceName}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={"contain center flex"}>
            {isSearchStarted ? (
              <Spin size="large" />
            ) : (
              <div
                className="button"
                onClick={scan}
                style={{ alignSelf: "center" }}
              >
                Cihazları Tara
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDevice;
