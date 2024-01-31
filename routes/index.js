const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./user");
const { createUser, login } = require("../controllers/user");
const handleAuthorization = require("../middlewares/auth");
const NotFoundError = require("../errors/notFoundError");
const {
  validateUserLogin,
  validateCreateUser,
} = require("../middlewares/validation");

router.use("/users", handleAuthorization, users);
router.use("/items", clothingItem);
router.post("/signin", validateUserLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Resource not found"));
});

module.exports = router;
