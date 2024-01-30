const express = require("express");
const handleAuthorization = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/user");
const { validateUserUpdate } = require("../middlewares/validation");

const router = express.Router();

// get users
// router.get("/", getUsers);
// router.get("/:userId", getUserById);
// router.post("/", createUser);
router.get("/me", handleAuthorization, getCurrentUser);
router.patch("/me", handleAuthorization, validateUserUpdate, updateUser);

module.exports = router;
