const {ipcMain,app,BrowserWindow} = require("electron");
const path = require("path");
const url = require('url');

const isDev = require("electron-is-dev");

let mainWindow;
let ble_callback;


app.commandLine.appendSwitch('enable-experimental-web-platform-features')
function createWindow() {
    mainWindow = new BrowserWindow({
        icon: __dirname+"/logo.png",
        fullscreen:true,
        title:"Aselsan",
        show:false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,

            //preload: __dirname + '/preload.js',
        },
    });
    mainWindow.once('ready-to-show', () => {

        mainWindow.show();
        mainWindow.maximize()
        if(isDev)
            mainWindow.webContents.openDevTools()
    })



    mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
        event.preventDefault()
        ble_callback = callback
        mainWindow.webContents.send('devices',deviceList);

    })

    mainWindow.loadURL(isDev
        ? "http://localhost:3000":url.format({
            pathname: path.join(__dirname, `./index.html`),
            protocol: "file:",
            slashes: true
        }));

    mainWindow.on("closed", () => (mainWindow = null));
}


app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("selected-device",((event,deviceId)=>{
    try {
        console.warn(deviceId)
        if(ble_callback){
            console.warn("selected ",deviceId)
            ble_callback(deviceId)
        }
    }catch (e) {

    }
}))

