const handleError = (err, req, res, next) => {
  console.error(err);
  if (err.statusCode !== 500) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      // check the status and display a message based on it
      message: statusCode === 500 ? "An error occurred on the server" : message,
    });
  }
  next();
};

module.exports = handleError;
