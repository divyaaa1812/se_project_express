const express = require("express");
const auth = require("../middlewares/auth");
const validateUserUpdate = require("../middlewares/validation");
const handleAuthorization = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/user");

const router = express.Router();

// get users
// router.get("/", getUsers);
// router.get("/:userId", getUserById);
// router.post("/", createUser);
router.get("/me", handleAuthorization, getCurrentUser);
router.patch("/me", handleAuthorization, updateUser);

module.exports = router;
