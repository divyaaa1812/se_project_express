const statusCode = require("../utils/constants");
const JWT_SECRET = require("../utils/config");

const handleAuthorization = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(statusCode.AUTHORIZATION_ERROR)
      .send({ message: "authorization error" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(statusCode.AUTHORIZATION_ERROR);
  }
  req.user = payload;
  return next();
};

module.exports = handleAuthorization;
