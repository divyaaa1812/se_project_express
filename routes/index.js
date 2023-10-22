const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./user");
const statusCode = require("../utils/constants");
const { createUser, login } = require("../controllers/user");

router.use("/users", users);
router.use("/items", clothingItem);
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res
    .status(statusCode.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
