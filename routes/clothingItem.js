// import router to work with CRUD operations
const router = require("express").Router();
const handleAuthorization = require("../middlewares/auth");
const handleErrors = require("../middlewares/errorHandler");
const { validateCreateUser, validateId } = require("../middlewares/validation");

const {
  addItem,
  getItems,
  deleteItem,
  likeAnItem,
  unlikeAnItem,
} = require("../controllers/clothingItem");

// add post to clothing item
router.post("/", handleAuthorization, validateCreateUser, addItem);
router.get("/", handleErrors, getItems);
// router.put("/:itemId", updateItem);
router.delete("/:itemId", handleAuthorization, validateId, deleteItem);
router.put("/:itemId/likes", handleAuthorization, validateId, likeAnItem);
router.delete("/:itemId/likes", handleAuthorization, validateId, unlikeAnItem);

module.exports = router;
