//import router to work with CRUD operations
const router = require("express").Router();
const { createItem } = require("../controllers/clothingItem");

//add post to clothing item
router.post("/", createItem);

module.export = { router };
