import { app, BrowserWindow, Menu } from 'electron';
import express from 'express';
import path from 'path';
import routes from './routes.mjs';
import { listRes } from './functions/list.mjs';    // Import the helper function
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Create __dirname equivalent in ES Module
const __dirname = new URL('.', import.meta.url).pathname;

let mainWindow;
let mouseMoveCount = parseInt(process.env.MOUSE_MOVE_COUNT || '0', 10);

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
        fullscreen: true,  // Make the window fullscreen
        webPreferences: {
            nodeIntegration: true,
            autoHideMenuBar: true,
        },
    });

    // Remove the default application menu
    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);

    // Load the Express app in the Electron window (localhost:3000)
    mainWindow.loadURL('http://localhost:3000');  // This should point to your Express server

    // Track mouse movement when the app window is not focused
    mainWindow.on('blur', () => {
        // Increment the mouse movement count every time the window loses focus
        mouseMoveCount++;
        
        // Lock the app after 3 mouse movements
        if (mouseMoveCount >= 2) {
            process.env.APP_LOCKED = 'true';  // Lock the app
            fs.writeFileSync('.env', `APP_LOCKED=true\nMOUSE_MOVE_COUNT=${mouseMoveCount}`);  // Write locked state to .env
            mainWindow.loadURL('http://localhost:3000/locked'); // Change the URL to the locked page
        } else {
            process.env.MOUSE_MOVE_COUNT = mouseMoveCount.toString();
            fs.writeFileSync('.env', `MOUSE_MOVE_COUNT=${mouseMoveCount}`);  // Update the count in the .env
        }
    });

    
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
