// import router to work with CRUD operations
const router = require("express").Router();
const handleAuthorization = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeAnItem,
  unlikeAnItem,
} = require("../controllers/clothingItem");

// add post to clothing item
router.post("/", createItem);
router.get("/", getItems);
// router.put("/:itemId", updateItem);
router.delete("/:itemId", handleAuthorization, deleteItem);
router.put("/:itemId/likes", handleAuthorization, likeAnItem);
router.delete("/:itemId/likes", handleAuthorization, unlikeAnItem);

module.exports = router;
