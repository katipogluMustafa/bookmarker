const {app, BrowserWindow} = require('electron');

let mainWindow = null;

app.on('ready', ()=>{
    console.log("First log");

    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavascript: false,
            contextIsolation: false,
        }
    });
    mainWindow.webContents.loadFile('app/index.html');
});