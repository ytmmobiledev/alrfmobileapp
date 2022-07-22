import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { string } from "../locales";
import Header, { HelpText, MoreInfoButton } from "../componenets/Header";
import { IStore } from "../stores/InstantStore";
import { Params } from "../constants/Params";
import { Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import BLEService from "../services/BLEService";
import { useHistory } from "react-router-dom";

const Device = () => {
  const history = useHistory();
  const ble = IStore.ble;
  const params = Params();
  const usage_params = {
    serial_no: params.serial_no,
    device_version: params.device_version,
    temperature: params.temperature,
    pressure: params.pressure,
    shot_counter: params.shot_counter,
    statuses: params.statuses,
  };

  const [data, setData] = useState(ble.getData());
  const [device, setDevice] = useState("loading");

  useEffect(() => {
    BLEService.event.on("monitor", _setData);
    controlDevice();

    return () => {
      BLEService.event.removeListener("monitor", _setData);
    };
  }, []);

  function _setData({ all_data }) {
    setData({ ...all_data });
  }

  function reload() {
    setData({
      ...data,
      ...{
        serial_no: "",
        device_version: "",
        temperature: "",
        pressure: "",
        shot_counter: "",
        statuses: {
          odometer_activity: {
            title: "lazermesafeolceraktifligi",
            value: null,
          },
          compass_activity: {
            title: "pusulaaktifligi",
            value: null,
          },
          bluetooth_activity: {
            title: "bluetoothaktifligi",
            value: null,
          },
          odometer_error: {
            title: "lazermesafeolcerhatabilgisi",
            value: null,
          },
          compass_error: {
            title: "pusulahatabilgisi",
            value: null,
          },
          bluetooth_error: {
            title: "bluetoothhatabilgisi",
            value: null,
          },
          battery_error: {
            title: "bataryahatabilgisi",
            value: null,
          },
        },
      },
    });

    controlDevice();
  }

  async function controlDevice() {
    const device = ble.getDevice();
    setDevice(device);

    if (device) {
      getValues();
    }
  }

  function getValues() {
    for (let [key, param] of Object.entries(usage_params)) {
      if (param.getHex) ble.sendDataToDevice(key, param.getHex).then(() => {});
    }
  }

  if (!device) {
    return (
      <div className="column contain center">
        <div style={{ fontSize: 20, color: Colors.text, fontWeight: "bold" }}>
          {string["101"]}
        </div>
        <div
          className="btn"
          onClick={() => {
            history.push("select-device");
          }}
          style={{
            margin: 10,
            padding: "10px 15px",
            backgroundColor: Colors.primary,
            borderRadius: 10,
            fontSize: 16,
            color: Colors.text,
            fontWeight: "bold",
          }}
        >
          {string.simdibaglan}
        </div>
      </div>
    );
  }

  if (device == "loading") {
    return null;
  }

  return (
    <div className="center contain column">
      <div className="center" style={{ width: "100%" }}>
        <Header left={() => <HelpText />} right={() => <MoreInfoButton />} />
      </div>
      <div
        className="flex row"
        style={{
          width: "50%",
          flexDirection: "space-between",
          alignItems: "center",
          fontSize: 25,
          fontWeight: "bold",
          color: Colors.primary,
        }}
      >
        <div className="flex-1"></div>
        <div className="flex-3 center" style={{ textAlign: "center" }}>
          {string.cihazdurumbilgisi}
        </div>
        <div className="flex-1" style={{ justifyContent: "flex-end" }}>
          <div className="btn" style={{ padding: 20 }} onClick={reload}>
            <ReloadOutlined style={{ fontSize: 20, color: Colors.text }} />
          </div>
        </div>
      </div>
      <div
        className="flex column scroll"
        style={{ width: "100%", height: "100vh" }}
      >
        <div
          style={{
            alignSelf: "center",
            padding: 20,
            margin: 20,
            borderRadius: 10,
            backgroundColor: Colors.secondary,
            width: "50%",
          }}
        >
          {Object.entries(usage_params).map(([key, { title }]) => {
            const value = data[key];

            return (
              <div
                key={key}
                style={{
                  margin: 5,
                  marginBottom: 20,
                  padding: 5,
                  borderStyle: "dashed",
                  borderWidth: 1,
                  borderRadius: 1,
                  borderColor: "#667587",
                }}
              >
                <div
                  style={{
                    color: Colors.text,
                    padding: 10,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {string[title]}
                </div>
                <hr style={{ borderColor: "#4c5f72" }} />
                <div>
                  {value ? (
                    typeof value == "string" ? (
                      <div
                        style={{
                          height: 50,
                          color: Colors.text,
                          padding: 10,
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        {value}
                      </div>
                    ) : (
                      Object.values(value).map(({ title, value }, index) => (
                        <div
                          key={index}
                          className="flex row"
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flex: 2,
                              textAlign: "left",
                              color: Colors.text,
                              padding: 10,
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            {string[title]}
                          </div>
                          <div
                            style={{
                              height: 40,
                              display: "flex",
                              flex: 1,
                              textAlign: "left",
                              color: Colors.text,
                              padding: 10,
                              fontSize: 14,
                              fontWeight: "bold",
                            }}
                          >
                            {value ? string[value] ?? value : <Spin />}
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    <div
                      style={{
                        padding: 10,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Spin />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div style={{ height: 100 }} />
        </div>
      </div>
    </div>
  );
};

export default observer(Device);
