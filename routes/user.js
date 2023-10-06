const {
  getUsers,
  doesUserExist,
  getUser,
  createUser,
} = require("../controllers/user");

//import router to work with CRUD operations
const router = require("express").Router();

//get users
router.get("/", getUsers);
router.get("/:userId", doesUserExist);
router.get("/:userId", getUser);
router.post("/", createUser);

module.exports = router;
