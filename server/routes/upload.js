// upload.js (routes/upload.js)

// dependencies
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");

const router = express.Router(); // Create an Express router instance
const storage = multer.memoryStorage(); // Set up multer to store uploaded files in memory
const upload = multer({ storage: storage }); // Create a multer instance with the specified storage

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get the uploaded file's buffer
    const fileBuffer = req.file.buffer;
    // Read the Excel file from the buffer
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });

    // Assuming the 'Defects' worksheet exists in the Excel file
    const worksheet = workbook.Sheets["Defects"]; // Get the 'Defects' worksheet from the Excel file

    // Check if the 'Defects' worksheet exists
    if (!worksheet) {
      return res
        .status(400)
        .json({ error: "Worksheet 'Defects' not found in the Excel file" });
    }

    // Convert the worksheet to a JSON object
    const jsonData = xlsx.utils.sheet_to_json(worksheet); // Parse the worksheet into JSON format

    // Log the JSON data to the console for debugging
    console.log(jsonData);

    // Send a response with the JSON data to the client
    res.json({ data: jsonData });
  } catch (error) {
    // Handle any errors that occur during file upload or processing
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
