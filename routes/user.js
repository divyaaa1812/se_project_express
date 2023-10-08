// import router to work with CRUD operations
const router = require("express").Router();

const { getUsers, getUserById, createUser } = require("../controllers/user");

// get users
router.get("/", getUsers);
// router.get("/:userId", doesUserExist);
router.get("/:userId", getUserById);
router.post("/", createUser);

module.exports = router;
