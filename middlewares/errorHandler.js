const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .send({ name: err.name, message: err.message });
  }
  return res.status(500).send({ name: err.name, message: err.message });
};

module.exports = errorHandler;
