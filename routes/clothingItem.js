// import router to work with CRUD operations
const router = require("express").Router();
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
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeAnItem);
router.delete("/:itemId/likes", unlikeAnItem);

module.exports = router;
