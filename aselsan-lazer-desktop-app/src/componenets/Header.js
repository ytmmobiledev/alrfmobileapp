import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { string } from "../locales";
import { LeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { IStore } from "../stores/InstantStore";
import { Contact } from "../pages/moreInfo";
import { Modal } from "antd";

export function HelpText() {
  const [visible, setVisible] = useState(false);

  function ContactModal() {
    return (
      <Modal
        bodyStyle={{ padding: 0, backgroundColor: Colors.darkGray }}
        centered
        closable={false}
        visible={visible}
        okText={string.kaydet}
        cancelText={string.kapat}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <Contact onClose={() => setVisible(false)} />
      </Modal>
    );
  }

  return (
    <>
      <ContactModal />
      <div
        className="btn"
        onClick={() => {
          setVisible(true);
        }}
        style={{
          cursor: "pointer",
          padding: 20,
          textDecorationLine: "underline",
          fontWeigh: "bold",
          fontSize: 14,
        }}
      >
        {string.yardimaihtiyacinvarmi}
      </div>
    </>
  );
}

export function MoreInfoButton({ close = false }) {
  const history = useHistory();

  if (close) {
    return (
      <div>
        <img
          style={{ marginTop: 15, width: 70, height: 75 }}
          src={require("../assets/images/secili-dahafazla.png").default}
        />
      </div>
    );
  }
  return (
    <div
      onClick={() => {
        history.push("more-info");
      }}
      className="btn"
    >
      <img
        style={{ width: 50, height: 50 }}
        src={require("../assets/images/dahafazla.png").default}
      />
    </div>
  );
}

function Header({
  onBack,
  left = () => <div />,
  title = "",
  right = () => <div />,
}) {
  return (
    <div
      className="flex row"
      style={{
        flexDirection: "space-between",
        alignItems: "center",
        color: Colors.text,
        width: "100%",
        height: 60,
        backgroundColor: Colors.darkGray,
      }}
    >
      <div className="flex-1 left">
        {onBack ? (
          <div className="btn" onClick={onBack} style={{ padding: 20 }}>
            <LeftOutlined style={{ fontSize: 25, color: Colors.text }} />
          </div>
        ) : null}
        {left()}
      </div>
      <div
        className="flex-1 center"
        style={{ fontSize: 18, fontWeight: "bold" }}
      >
        {title}
      </div>
      <div className="flex-1 right">{right()}</div>
    </div>
  );
}

export default Header;
