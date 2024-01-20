const express = require("express");
const app = express();

const handleError = app.use((err, req, res, next) => {
  console.error(err);
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      // check the status and display a message based on it
      message: statusCode === 500 ? "An error occurred on the server" : message,
    });
  }
});

module.exports = handleError;
