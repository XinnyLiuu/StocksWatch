const { app, BrowserWindow, Menu } = require('electron')

// Remove top toolbar
Menu.setApplicationMenu(false)

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 1200, height: 800 });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL('https://stockswatch.netlify.com/');

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
app.on('ready', createWindow);

// So that the app stops on window close only on OSes that support it
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
        mainWindow.removeMenu();
    }
});
