const express = require("express"); // import express library
const mongoose = require("mongoose");
const app = express(); //instance of express application
const { PORT = 3001 } = process.env;

//connect db
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to DB", r);
});

//define routes
const routes = require("./routes");
app.use(express.json());
app.use(routes);

//calling server by passing in port variable
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
