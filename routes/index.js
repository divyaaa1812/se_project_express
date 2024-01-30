const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./user");
const { createUser, login } = require("../controllers/user");
const handleAuthorization = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");

router.use("/users", handleAuthorization, users);
router.use("/items", clothingItem);
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Resource not found"));
});

module.exports = router;
