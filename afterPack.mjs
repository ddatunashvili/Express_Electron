import fs from 'fs-extra';
import path from 'path';

// Manually define __dirname equivalent for ES modules
const __dirname = new URL('.', import.meta.url).pathname;

export default async function (context) {
  console.log('Packing finished!');

  // Get the output directory where the app is packed (win-unpacked)
  const outputDir = context.appOutDir;

  // Define the source and destination paths for the public folder
  const publicSourceDir = path.join(__dirname, 'public'); // Source location of 'public'
  const publicDestDir = path.join(outputDir, 'public');   // Destination location in the output directory

  console.log('Preparing to copy from', publicSourceDir, 'to', publicDestDir);

  try {
    // Ensure the 'public' folder exists in the source directory
    if (await fs.pathExists(publicSourceDir)) {
      console.log('Public folder exists in the source directory');

      // Copy the entire public folder to the destination
      await fs.copy(publicSourceDir, publicDestDir);
      console.log('Public folder successfully copied to the output directory');
    } else {
      console.error('Public folder is missing in the source directory!');
    }

    // Optionally, list files in the destination directory for debugging
    const files = await fs.readdir(publicDestDir);
    console.log('Files in the public directory:', files);
  } catch (error) {
    console.error('Error during the copy operation:', error);
  }
}
