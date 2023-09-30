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

    // Create a JSON array to store the data progressively
    let jsonDataArray = [];

    // Create a streaming JSON response
    res.setHeader("Content-Type", "application/json");

    // Create a readable stream from the worksheet data
    const stream = xlsx.stream.to_json(worksheet);

    // Handle each row of data as it's read from the stream
    stream.on("data", (row) => {
      // Function to check if all keys have empty values
      function hasAllEmptyValues(obj) {
        for (const key in obj) {
          if (obj[key] !== "") {
            return false;
          }
        }
        return true;
      }

      // Check if the row has all empty values
      if (!hasAllEmptyValues(row)) {
        jsonDataArray.push(row);
        // Send the row as a JSON object to the client
        res.write(JSON.stringify(row));
      }
    });

    // When the stream ends, send the complete JSON array
    stream.on("end", () => {
      res.end();
      // Log the JSON data to the console for debugging
      console.log(jsonDataArray);
    });
  } catch (error) {
    // Handling any errors that occur during file upload or processing
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
