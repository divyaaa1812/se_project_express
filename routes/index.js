const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./user");
const statusCode = require("../utils/constants");

router.use("/users", users);
router.use("/items", clothingItem);

router.use((req, res) => {
  res
    .status(statusCode.DEFAULT)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
