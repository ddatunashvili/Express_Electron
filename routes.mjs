import express from 'express';
import path from 'path';
import { listResources, servePDF } from './controllers/exampleController.mjs';
import fs from 'fs';

// Create __dirname equivalent in ES Module
const __dirname = new URL('.', import.meta.url).pathname;

const router = express.Router();

// Route for the example controller

// Serve static files from the public folder
router.get('/', (req, res) => {
    res.sendFile('/public/index.html', { root: '.' });
});

// Route to list available resources (e.g., PDFs in the 'resources' folder)
router.get('/resources', listResources);

router.get('/style.css', (req, res) => {
    res.sendFile('/public/style.css', { root: '.' });
});

router.get('/locked', (req, res) => {
    res.sendFile('/public/locked.html', { root: '.' });
});

// Route to serve a specific PDF file from the 'resources' folder
router.get('/resources/:fileName', servePDF);

const envFilePath = path.join( '.env');

// Route to clean (clear) the .env file

// Route to clean (clear) the .env file
router.get('/clean-env', (req, res) => {
    fs.truncate(envFilePath, 0, (err) => {
        console.log("cleaning complete")
        if (err) {
            return res.status(500).send('Error cleaning .env file');
        }
        // Redirect to the main page after cleaning the .env file
        res.redirect('http://localhost:3000/');

    });
});

export default router;
