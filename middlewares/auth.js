const jwt = require("jsonwebtoken");
const statusCode = require("../utils/constants");
const JWT_SECRET = require("../utils/config");

const handleAuthorization = (req, res, next) => {
  // get authorization from the header
  const { authorization } = req.headers;

  // check the header exists and starts with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res
      .status(statusCode.AUTHORIZATION_ERROR)
      .send({ message: "authorization error" });
  }
  // get token
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    res.status(statusCode.AUTHORIZATION_ERROR);
  }
  req.user = payload;
  next();
};

module.exports = handleAuthorization;
