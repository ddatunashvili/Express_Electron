import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Create __dirname equivalent in ES Module
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Convert file URL to path

// Route to list available resources (e.g., PDFs in the 'resources' folder)
export const listResources = (req, res) => {
    // Correct path to the 'resources' folder using path.resolve
    const resourcesDirectory = path.resolve(__dirname, '..', 'resources');  // Resolve to absolute path

    // Log the path for debugging purposes
    console.log("Resources Directory:", resourcesDirectory);

    fs.readdir(resourcesDirectory, (err, files) => {
        if (err) {
            // Log error and return response with 500 status code
            console.error("Error reading directory:", err);
            return res.status(500).json({ error: 'Failed to list resources' });
        }

        // Filter PDF files or any file types you want to show
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));

        // Send the list of available PDF files in JSON format
        res.json({
            message: 'Available resources',
            pdfFiles,
        });
    });
};

// Route to serve a specific PDF file from the 'resources' folder
export const servePDF = (req, res) => {
    const { fileName } = req.params;
    const filePath = path.resolve(__dirname, '..', 'resources', fileName);  // Resolve to absolute path

    // Log the file path for debugging purposes
    console.log("File Path:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Send the file as a response
    res.sendFile(filePath);
};
