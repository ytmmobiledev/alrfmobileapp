const { ipcMain, app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const { ConnectionBuilder } = require("electron-cgi");

const isDev = require("electron-is-dev");

let mainWindow;
let ble_callback;

app.commandLine.appendSwitch("enable-experimental-web-platform-features");
function createWindow() {
  mainWindow = new BrowserWindow({
    icon: __dirname + "/logo.png",
    /*fullscreen:true,
        minHeight:1000,
        minWidth:1000,*/
    title: "Aselsan",
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,

      //preload: __dirname + '/preload.js',
    },
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    // mainWindow.maximize()
    if (isDev) mainWindow.webContents.openDevTools();
  });

  mainWindow.webContents.on(
    "select-bluetooth-device",
    (event, deviceList, callback) => {
      event.preventDefault();
      ble_callback = callback;

      mainWindow.webContents.send("devices", deviceList);
    }
  );

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : url.format({
          pathname: path.join(__dirname, `./index.html`),
          protocol: "file:",
          slashes: true,
        })
  );

  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("selected-device", (event, deviceId) => {
  try {
    if (ble_callback) {
      ble_callback(deviceId);
    }
  } catch (e) {}
});

ipcMain.on("get-location", (event) => {
  getLocation();
});

async function getLocation() {
  try {
    let connection = new ConnectionBuilder()
      .connectTo(
        "dotnet",
        "run",
        "--project",
        isDev ? "./public/Core/DotNetLocation" : "DotNetLocation"
      )
      .build();

    connection.onDisconnect = () => {
      console.warn("finish-location");
    };

    const response = await connection.send("find-location", "");
    try {
      mainWindow.webContents.send(
        "find-location",
        response.toString().split("-")
      );
    } catch (e) {}

    connection.close();
  } catch {}
}
