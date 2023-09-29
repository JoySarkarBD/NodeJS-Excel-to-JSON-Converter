// upload.js (routes/upload.js)

// dependencies
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");

const router = express.Router(); // Express router instance
const storage = multer.memoryStorage(); // multer to store uploaded files in memory
const upload = multer({ storage: storage }); // multer instance with the specified storage

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    // Checking if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Getting the uploaded file's buffer
    const fileBuffer = req.file.buffer;
    // Reading the Excel file from the buffer
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });

    // Assuming the 'Defects' worksheet exists in the Excel file
    const worksheet = workbook.Sheets["Defects"]; // Get the 'Defects' worksheet from the Excel file

    // Checking if the 'Defects' worksheet exists
    if (!worksheet) {
      return res
        .status(400)
        .json({ error: "Worksheet 'Defects' not found in the Excel file" });
    }

    // Converting the worksheet to a JSON object
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      defval: "", // Set default value for empty cells to an empty string
    }); // Parsing the worksheet into JSON format

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

module.exports = router;
