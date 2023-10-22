// import router to work with CRUD operations
const router = require("express").Router();
const handleAuthorization = require("../middlewares/auth");

const { getCurrentUser, updateUser } = require("../controllers/user");

// get users
// router.get("/", getUsers);
// router.get("/:userId", getUserById);
// router.post("/", createUser);
router.get("/me", handleAuthorization, getCurrentUser);
router.patch("/me", handleAuthorization, updateUser);

module.exports = router;
