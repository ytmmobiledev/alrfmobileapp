import * as React from "react";

import { observer } from "mobx-react-lite";
import { IStore } from "../stores/InstantStore";
import { useEffect, useState } from "react";
import { InputNumber, Modal, Spin } from "antd";
import { string } from "../locales";
import Colors from "../constants/Colors";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { error } from "../functions/toast";

export const setModalTypes = {
  Select: "select",
  Number: "number",
};

function SetModal() {
  const {
    visible,
    title = "",
    description = "",
    icon = require("../assets/images/cihaz2.png"),
    value,
    options,
    type,
    numberParams = {},
    onChange = async (data: any) => {},
  } = IStore.set_modal;

  const [defaultValue, setDefaultValue]: any = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDefaultValue(value);
  }, [value]);

  return (
    <Modal
      bodyStyle={{ padding: 0, backgroundColor: Colors.darkGray }}
      centered
      closable={false}
      visible={visible}
      okText={string.kaydet}
      cancelText={string.kapat}
      onOk={() => {
        IStore.setSetModal({ visible: false });
      }}
      onCancel={() => {
        IStore.setSetModal({ visible: false });
      }}
      footer={null}
    >
      <div style={{ width: "100%" }}>
        {icon ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              className="background-img"
              style={{
                display: "flex",
                width: 60,
                height: 55,
                backgroundImage: `url(${
                  require("../assets/images/modal/corner.png").default
                })`,
              }}
            >
              <div
                style={{ marginLeft: 20, marginBottom: 10 }}
                className="flex-1 center"
              >
                <img src={icon.default} height={25} width={25} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: 25 }} />
        )}
        <div style={{ padding: 15 }}>
          {title ? (
            <div
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: Colors.text,
                textAlign: "center",
              }}
            >
              {string[title]}
            </div>
          ) : null}
          {description ? (
            <div
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: Colors.text,
                textAlign: "center",
              }}
            >
              {string[description]}
            </div>
          ) : null}
        </div>
        <div className="flex center" style={{ width: "100%", padding: 10 }}>
          {type == setModalTypes.Select ? (
            <Select
              defaultValue={defaultValue}
              options={options}
              onChange={(data: any) => {
                setDefaultValue(data);
              }}
            />
          ) : type == setModalTypes.Number ? (
            <Number
              numberParams={numberParams}
              defaultValue={defaultValue}
              onChange={(data: any) => {
                setDefaultValue(data);
              }}
            />
          ) : null}
        </div>

        <div
          className={"flex row"}
          style={{
            padding: 15,
            width: "100%",
            margin: "40px 0",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div className="flex-1 center">
            <div
              className="btn"
              style={{
                fontSize: 18,
                color: Colors.primary,
                fontWeight: "bold",
                padding: 10,
              }}
              onClick={() => {
                IStore.setSetModal({ visible: false });
              }}
            >
              {string.kapat}
            </div>
          </div>
          <div className="flex-1 center">
            <div
              className="btn"
              style={{
                fontSize: 18,
                color: Colors.primary,
                fontWeight: "bold",
                padding: 10,
              }}
              onClick={() => {
                if (loading) {
                  return;
                }
                let value: any = defaultValue;

                if (type == setModalTypes.Number) {
                  let { fixed, min, max, unit = "" } = numberParams;

                  value = parseInt(value.toString());
                  console.warn(value, max);

                  if (isNaN(value) || !/^-?\d+$/.test(value.toString())) {
                    error("Geçersiz Veri");
                    return;
                  }
                  if (min != undefined && value < min) {
                    if (fixed) {
                      min = min / Math.pow(10, fixed);
                    }
                    error("Minimum " + min + " " + unit);
                    return;
                  }
                  if (max != undefined && value > max) {
                    if (fixed) {
                      max = max / Math.pow(10, fixed);
                    }
                    error("Maximum " + max + " " + unit);
                    return;
                  }
                }

                setLoading(true);
                onChange(value).then(() => {
                  setLoading(false);
                  IStore.setSetModal({ visible: false });
                });
              }}
            >
              {loading ? <Spin /> : string.kaydet}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Select({ defaultValue, options, onChange }: any) {
  return (
    <div style={{ width: "50%" }}>
      {Array.isArray(options)
        ? options.map(({ id, value }: any) => (
            <div
              key={id}
              style={{ width: "100%" }}
              onClick={() => {
                onChange(id);
              }}
            >
              <div
                style={
                  {
                    borderBottomStyle: "dashed",
                    borderBottomWidth: 1,
                    borderRadius: 1,
                    borderColor: "#667587",
                    padding: 10,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "--active-color":
                      Colors.text + (defaultValue == id ? "" : "88"),
                    "--default-color": Colors.text,
                  } as React.CSSProperties
                }
                className={`flex row select-button`}
              >
                <div
                  style={
                    {
                      display: "flex",
                      flex: 1,
                      fontSize: 15,
                      fontWeight: "bold",
                      // color: Colors.text + (defaultValue == id ? "" : "88"),
                      padding: 7,
                    } as React.CSSProperties
                  }
                >
                  {string[value] ?? value}
                </div>
                {defaultValue == id ? (
                  <CheckCircleOutlined
                    style={{
                      fontSize: 18,
                      // color: Colors.text + (defaultValue == id ? "" : "88"),
                    }}
                  />
                ) : (
                  <MinusCircleOutlined
                    style={{
                      fontSize: 18,
                      // color: Colors.text + (defaultValue == id ? "" : "88"),
                    }}
                  />
                )}
              </div>
            </div>
          ))
        : null}
    </div>
  );
}

function Number({
  defaultValue = "loading",
  onChange,
  numberParams = {},
}: any) {
  let { fixed = 0, min = 0, max = 0, unit = "" } = numberParams;

  if (fixed) {
    min = min / Math.pow(10, fixed);
    max = max / Math.pow(10, fixed);
  }

  if (defaultValue == "loading") return null;

  return (
    <div className="flex center" style={{ width: "100%" }}>
      <div
        className="flex row"
        style={{
          width: "50%",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "center",
          display: "flex",
          padding: 10,
          borderStyle: "dashed",
          borderWidth: 1,
          borderRadius: 1,
          borderColor: "#667587",
        }}
      >
        <InputNumber
          bordered={false}
          precision={fixed}
          style={{
            flex: 1,
            color: Colors.text,
            backgroundColor: Colors.darkGray,
            borderColor: Colors.text,
          }}
          size="large"
          min={min}
          max={max}
          defaultValue={defaultValue / Math.pow(10, fixed)}
          stringMode
          onChange={(num) => {
            onChange(num * Math.pow(10, fixed));
          }}
        />
        <div style={{ fontSize: 14, color: Colors.text }}>{unit}</div>
      </div>
    </div>
  );
}

export default observer(SetModal);
