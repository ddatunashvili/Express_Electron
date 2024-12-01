import { app, BrowserWindow } from 'electron';
import express from 'express';
import path from 'path';
import routes from './routes.mjs';
import { listRes } from './functions/list.mjs';    // Import the helper function

// Create __dirname equivalent in ES Module
const __dirname = new URL('.', import.meta.url).pathname;

let mainWindow;

// Initialize Express
const expressApp = express();

// Use the routes for handling specific routes like /example, etc.
expressApp.use(routes);

// Serve static files from the public folder
expressApp.use(express.static(path.join(__dirname, 'public')));

// Call the helper function to list resources (or perform any other operations)
listRes();

// Start the Express server
const server = expressApp.listen(3000, () => {
    console.log('Express server running on http://localhost:3000');
});

// Create the Electron window when the app is ready
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Load the Express app in the Electron window (localhost:3000)
    mainWindow.loadURL('http://localhost:3000');  // This should point to your Express server

    // Open DevTools for debugging (optional)
    // mainWindow.webContents.openDevTools();
});

// Quit app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Close the Express server when the Electron app closes
app.on('before-quit', () => {
    server.close();
});
