// app.js (server/app.js)

// dependencies
const express = require("express");
const path = require("path");
const uploadRoutes = require("./routes/upload");

const app = express(); // Create an Express application instance

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")));

// Define routes handled by the 'uploadRoutes' router
app.use("/api", uploadRoutes);

module.exports = app;
