require("dotenv").config();

const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// instance of express application
const app = express();
const { PORT = 3001 } = process.env;

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

console.log(process.env.NODE_ENV);

// connect db
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", () => {
  console.log("connected to DB");
});

// app.use(
//   cors({
//     origin: "https://wtwrdivya.crabdance.com",
//     methods: "*",
//   }),
// );
// app.options("*", cors());
app.use(express.json());

// protect app from some well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());
// enable the loggers
app.use(requestLogger);
app.use(routes);
// enabling the error logger
app.use(errorLogger);
// celebrate error handler
app.use(errors());
// centralized error handler
app.use(errorHandler);

// calling server by passing in port variable
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
