import React, { useEffect, useRef, useState } from "react";
import GoogleMapReact, { fitBounds } from "google-map-react";
import { IStore } from "../stores/InstantStore";
import { Spin } from "antd";
import Colors from "../constants/Colors";
import { findLocation } from "../functions/findLocation";
import BLEService from "../services/BLEService";
import { info } from "../functions/toast";
import { Params } from "../constants/Params";
import { distanceConversion } from "../functions/Conversions";
import { useHistory } from "react-router-dom";
import { string } from "../locales";
import { DistanceUnitTypes } from "../constants/Config";
import { ipcRenderer } from "electron";

let _compass = false;
let old_heading = 0;
let _location = {};
let target_locations = [];
let bound_target = {};
let maps = null;

const coords = {
  accuracy: 15.98,
  altitude: 124.65,
  altitudeAccuracy: 3.5,
  heading: null,
  latitude: 0,
  longitude: 0,
  speed: null,
};

const LaserMeter = () => {
  const ble = IStore.ble;
  const history = useHistory();
  const param = Params();
  const map = useRef();
  const div = useRef();

  const [location, setLocation] = useState(null);
  const [targets, setTargets] = useState(null);
  const [heading, setHeading] = useState(old_heading);
  const [compass, setCompass] = useState(_compass);
  const [distance_unit, setDistanceUnit] = useState({});
  const [loading, setLoading] = useState(false);

  const target_len = Array.isArray(targets) ? targets.length : 0;

  useEffect(() => {
    try {
      ipcRenderer.send("get-location", null);
      ipcRenderer.on("find-location", getLocation);
    } catch (e) {}

    BLEService.event.on("distance_and_compass", _setData);

    return () => {
      BLEService.event.removeListener("distance_and_compass", _setData);
      ipcRenderer.removeListener("find-location", getLocation);
    };
  }, []);

  async function getLocation(e, res) {
    console.warn(res);
    _location = {
      ...coords,
      latitude: parseFloat(res[0].replace(",", ".")),
      longitude: parseFloat(res[1].replace(",", ".")),
      altitude: parseFloat(res[2].replace(",", ".")),
      accuracy: parseFloat(res[3].replace(",", ".")),
      altitudeAccuracy: parseFloat(res[4].replace(",", ".")),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setLocation(_location);
    await ble.sendDataToDevice(
      "distance_and_compass",
      param.distance_and_compass.getHex
    );
  }

  function _setData({
    distance,
    distance_unit,
    angle_unit,
    azimuth,
    elevation,
    roll,
  }) {
    if (azimuth == 0 || azimuth == 180 || azimuth == 360) azimuth += 0.000001;
    azimuth = azimuth % 360;

    setLoading(false);
    if (!_location?.latitude) return;

    target_locations = [];

    for (const val of distance) {
      let target = findLocation(
        _location.latitude,
        _location.longitude,
        val,
        azimuth,
        elevation,
        angle_unit,
        distance_unit
      );
      target_locations.push({
        ...target,
        height: target.y_distance,
        distance: target.x_distance,
        azimuth,
        polyline: maps
          ? new maps.Polyline({
              path: [
                { lat: target.latitude, lng: target.longitude },
                { lat: _location.latitude, lng: _location.longitude },
              ],
              geodesic: true,
              strokeColor: Colors.text,
              strokeOpacity: 0.7,
              strokeWeight: 4,
            })
          : null,
      });
    }
    bound_target = target_locations[distance.indexOf(Math.max(...distance))];
    setTargets([...target_locations]);
    setDistanceUnit({
      unit: distanceConversion(distance, distance_unit, distance_unit).unit,
      id: distance_unit,
    });

    try {
      for (const { polyline } of target_locations) {
        polyline.setMap(map.current);
      }
    } catch (e) {}

    setTimeout(() => {
      try {
        if (!_compass && maps) {
          map.current.panTo([
            ...target_locations.map(({ latitude, longitude }) => ({
              lat: latitude,
              lng: longitude,
            })),
            { lat: _location.latitude, lng: _location.longitude },
          ]);
        }
      } catch (e) {}
    }, 1000);
  }

  function controlDevice() {
    try {
      for (const { polyline } of target_locations) {
        polyline.setMap(null);
      }
    } catch (e) {}
    setTargets([]);
    const device = ble.getDevice();

    if (device) {
      findTarget();
    } else {
      history.push("select-device");
    }
  }
  async function findTarget() {
    info("Atış Yapılıyor...");
    setLoading(true);
    ipcRenderer.send("get-location", null);
  }

  const Marker = ({ my, title }) => {
    if (my) {
      return (
        <div
          className="center"
          style={{
            marginTop: -15,
            marginLeft: -15,
            width: 30,
            height: 30,
            backgroundColor: Colors.primary,
            borderRadius: 100,
          }}
        >
          <div
            style={{
              width: 15,
              height: 15,
              backgroundColor: Colors.white,
              borderRadius: 100,
            }}
          ></div>
        </div>
      );
    }
    return (
      <div className="flex center column" style={{ marginTop: -40 }}>
        <img
          src={
            target_len > 1
              ? require("../assets/images/placeholder-full.png").default
              : require("../assets/images/placeholder.png").default
          }
          style={{ width: 40, height: 40 }}
        />
        {target_len > 1 ? (
          <div
            style={{
              marginBottom: 10,
              position: "absolute",
              textAlign: "center",
              fontSize: 17,
              color: Colors.white,
              fontWeight: "bold",
            }}
          >
            {title}
          </div>
        ) : null}
      </div>
    );
  };

  if (!location)
    return (
      <div className="contain center">
        <Spin />
      </div>
    );

  let center = { lat: location.latitude, lng: location.longitude },
    zoom = 15;

  if (Array.isArray(targets) && targets.length) {
    const res = fitBounds(
      bound_target.azimuth > 180
        ? {
            ne: {
              lat: location.latitude,
              lng: location.longitude,
            },
            sw: {
              lat: bound_target.latitude,
              lng: bound_target.longitude,
            },
          }
        : {
            nw: {
              lat: location.latitude,
              lng: location.longitude,
            },
            se: {
              lat: bound_target.latitude,
              lng: bound_target.longitude,
            },
          },
      {
        width: div?.current?.offsetWidth ?? 0, // Map width in pixels
        height: div?.current?.offsetHeight ?? 0, // Map height in pixels
      }
    );
    center = res.center;
    zoom = (res.zoom ?? 10) - 0.5;
  }

  function ConvertDDToDMS(D) {
    return [
      0 | D,
      "D ",
      0 | (((D = (D < 0 ? -D : D) + 1e-4) % 1) * 60),
      "' ",
      0 | (((D * 60) % 1) * 60),
      '"',
    ].join("");
  }

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <div ref={div} style={{ display: "flex", height: "55%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAJ_6n7wqqK8sIk0LV6IqO3OuukpMIbQMM" }}
          center={center}
          zoom={zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map: _map, maps: _maps }) => {
            map.current = _map;
            maps = _maps;
          }}
          options={{
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#242f3e" }],
              },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#746855" }],
              },
              ...require("../assets/styles/googleMap.json"),
            ],
          }}
        >
          <Marker lat={location.latitude} lng={location.longitude} my />
          {Array.isArray(targets) && targets.length
            ? targets.map((target, index) => (
                <Marker
                  key={index}
                  lat={target.latitude}
                  lng={target.longitude}
                  title={index + 1}
                />
              ))
            : null}
        </GoogleMapReact>
      </div>
      <div
        className="flex-1 center column"
        style={{ height: "45%", width: "100%" }}
      >
        {target_len ? (
          <div
            className="flex-1 row center"
            style={{
              ...(target_len == 1 ? {} : { display: "-webkit-box" }),
              overflowX: "scroll",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {Array.isArray(targets)
              ? targets.map(
                  ({ latitude, longitude, height, distance }, index) => (
                    <div key={index} style={{ padding: 10, margin: 10 }}>
                      {target_len > 1 ? (
                        <div
                          style={{
                            textAlign: "center",
                            width: "100%",
                            fontSize: "1.1rem",
                            marginBottom: 15,
                            color: Colors.white,
                            textDecorationLine: "underline",
                            fontWeight: "500",
                          }}
                        >
                          {"Hedef " + (index + 1)}
                        </div>
                      ) : null}

                      <div
                        className="flex row"
                        style={{
                          backgroundColor: Colors.primary + "20",
                          borderRadius: 10,
                          padding: 5,
                          margin: 5,
                        }}
                      >
                        <div
                          className="flex column"
                          style={{
                            padding: 10,
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <img
                            src={
                              require("../assets/images/distance.png").default
                            }
                            style={{ width: "2.2rem", height: "2.2rem" }}
                          />
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: Colors.white,
                              fontWeight: "bold",
                            }}
                          >
                            {parseFloat(distance).toFixed(2) +
                              distance_unit.unit}
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: Colors.primary,
                            }}
                          >
                            {string.mesafe2}
                          </div>
                        </div>
                        <div
                          className="flex column"
                          style={{
                            padding: 10,
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <img
                            src={require("../assets/images/target.png").default}
                            style={{ width: "2.2rem", height: "2.2rem" }}
                          />
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: Colors.white,
                              fontWeight: "bold",
                            }}
                          >
                            {"±" +
                              parseFloat(
                                distanceConversion(
                                  location.accuracy,
                                  DistanceUnitTypes.Metre.id,
                                  distance_unit.id
                                ).distance
                              ).toFixed(2) +
                              distance_unit.unit}
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: Colors.primary,
                            }}
                          >
                            {string.konumdogrulugu}
                          </div>
                        </div>
                        <div
                          className="flex column"
                          style={{
                            padding: 10,
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <img
                            src={require("../assets/images/height.png").default}
                            style={{ width: "2.2rem", height: "2.2rem" }}
                          />
                          <div className="flex row center">
                            <div
                              style={{
                                fontSize: "0.9rem",
                                color: Colors.white,
                                fontWeight: "bold",
                              }}
                            >
                              {parseFloat(
                                height + (location.altitude ?? 0)
                              ).toFixed(2) + distance_unit.unit}
                            </div>
                            {location.altitudeAccuracy ? (
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  color: Colors.white,
                                  fontWeight: "bold",
                                  marginLeft: 5,
                                }}
                              >
                                {"±" +
                                  parseInt(
                                    distanceConversion(
                                      location.altitudeAccuracy,
                                      DistanceUnitTypes.Metre.id,
                                      distance_unit.id
                                    ).distance
                                  )}
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: Colors.primary,
                            }}
                          >
                            {string.yukseklik}
                          </div>
                        </div>
                      </div>
                      <div
                        className="flex row"
                        style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div
                          className="flex-1 column"
                          style={{
                            padding: 10,
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <div
                            className="center"
                            style={{
                              width: "1.8rem",
                              height: "1.8rem",
                              backgroundColor: Colors.primary,
                              borderRadius: 100,
                            }}
                          >
                            <div
                              style={{
                                width: "0.9rem",
                                height: "0.9rem",
                                backgroundColor: Colors.white,
                                borderRadius: 100,
                              }}
                            ></div>
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: Colors.white,
                              fontWeight: "bold",
                            }}
                          >
                            {ConvertDDToDMS(location.latitude) + " N"}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: Colors.white,
                              fontWeight: "500",
                            }}
                          >
                            {ConvertDDToDMS(location.longitude) + " E"}
                          </div>
                        </div>
                        <div
                          className="flex-1"
                          style={{
                            borderStyle: "dashed",
                            borderWidth: 1,
                            borderRadius: 1,
                            borderColor: "#667587",
                          }}
                        />
                        <div
                          className="flex-1 column"
                          style={{
                            padding: 10,
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <img
                            src={
                              require("../assets/images/placeholder.png")
                                .default
                            }
                            style={{ width: "1.8rem", height: "1.8rem" }}
                          />
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: Colors.white,
                              fontWeight: "500",
                            }}
                          >
                            {ConvertDDToDMS(latitude) + " N"}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: Colors.white,
                              fontWeight: "500",
                            }}
                          >
                            {ConvertDDToDMS(longitude) + " E"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              : null}
          </div>
        ) : null}
        <div
          onClick={controlDevice}
          className="flex row center btn"
          style={{
            padding: "10px 15px",
            margin: 10,
            borderRadius: 10,
            backgroundColor: Colors.primary,
          }}
        >
          <div
            style={{ color: Colors.white, fontWeight: "bold", fontSize: 14 }}
          >
            {string.atisyap}
          </div>
          <img
            src={require("../assets/images/measure.png").default}
            style={{ width: 25, height: 25 }}
          />
        </div>
      </div>
    </div>
  );
};

export default LaserMeter;
