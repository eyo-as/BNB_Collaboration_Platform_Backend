// import the express module
const express = require("express");
// import the db connection file
const connection = require("./config/db.config");
// import the cors module
const cors = require("cors");
// import the dotenv module and call the config method to load the environment variables
require("dotenv").config();
// import the routes
const routes = require("./routes");
// get the port from the environment variable
const PORT = process.env.DB_PORT;

// create the express application
const app = express();
// Set up the CORS options to allow requests from our front-end
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};
// sample get request
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// add the cors middleware
app.use(cors(corsOptions));
// add the express.json middleware
app.use(express.json());

// add the routes to the middleware chain
app.use("/", routes);
// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// export the app
module.exports = app;
