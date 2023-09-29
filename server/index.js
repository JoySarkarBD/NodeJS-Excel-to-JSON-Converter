// index.js (server/index.js)

const app = require("./app");
const port = process.env.PORT || 3000; // Defining the port for the server to listen on

// Starting the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Open this link by the browser: http://localhost:${port}/`);
});
