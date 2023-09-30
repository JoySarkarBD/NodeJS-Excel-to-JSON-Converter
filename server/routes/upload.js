// upload.js

// Import necessary libraries
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");

// Create an Express router instance
const router = express.Router();

// Configure multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a route for handling file uploads
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract the file buffer from the request
    const fileBuffer = req.file.buffer;

    // Read the Excel file from the buffer
    const workbook = await readExcel(fileBuffer);

    // Get the 'Defects' worksheet from the Excel file
    const worksheet = workbook.Sheets["Defects"];

    // Check if the 'Defects' worksheet exists
    if (!worksheet) {
      return res
        .status(400)
        .json({ error: "Worksheet 'Defects' not found in the Excel file" });
    }

    // Convert the worksheet to a JSON object
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      defval: "", // Set default value for empty cells to an empty string
    });

    // Function to check if all keys have empty values
    function hasAllEmptyValues(obj) {
      for (const key in obj) {
        if (obj[key] !== "") {
          return false;
        }
      }
      return true;
    }

    // Filter out objects where all keys have empty values
    const filteredData = jsonData.filter((item) => !hasAllEmptyValues(item));

    // Log the JSON data to the console for debugging
    console.log(filteredData);

    // Sending a response with the JSON data to the client
    res.json(filteredData);
  } catch (error) {
    // Handling any errors that occur during file upload or processing
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Function to read an Excel file from a buffer and return a Promise
const readExcel = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    resolve(workbook);
  });
};

// Export the router for use in the application
module.exports = router;
