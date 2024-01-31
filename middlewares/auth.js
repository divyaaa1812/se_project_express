const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorizedError");

const handleAuthorization = (req, res, next) => {
  // get authorization from the header
  const { authorization } = req.headers;

  // check the header exists and starts with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("authorization error"));
  }
  // get token
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    next(new UnauthorizedError("authorization error"));
  }
  req.user = payload;
  next();
};

module.exports = handleAuthorization;
