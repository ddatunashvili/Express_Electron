import express from 'express';
import path from 'path';
import { listResources, servePDF } from './controllers/exampleController.mjs';

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

// Route to serve a specific PDF file from the 'resources' folder
router.get('/resources/:fileName', servePDF);

export default router;
