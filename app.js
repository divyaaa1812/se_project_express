const express = require("express"); // import express library
const app = express(); //instance of express application
const { PORT = 3001 } = process.env;

//define routes

//calling server by passing in port variable
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//connect to mongodb server
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
