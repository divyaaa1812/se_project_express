const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");

// instance of express application
const app = express();
const { PORT = 3001 } = process.env;

// connect db
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", () => {
  console.log("connected to DB");
});

// define routes
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "*",
  }),
);
app.use(routes);

// calling server by passing in port variable
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
