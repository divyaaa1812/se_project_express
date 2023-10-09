// create controllers

const ClothingItem = require("../models/clothingItem");
const statusCode = require("../utils/constants");

// create method to perform post operation to add new items to DB
const createItem = (req, res) => {
  // extract data from body request
  const author = req.user._id;
  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL, owner: author })
    .then((data) => {
      res.send({ item: data });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(statusCode.BAD_REQUEST).send({
          message: `An unknown error "${err.name} "has occurred: ${err.message}`,
        });
      }
      res.status(statusCode.DEFAULT).send({ message: "Error adding item" });
    });
};

// create method to perform get operation to retrieve items from DB
const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => res.send(items))
    .catch((e) => {
      res
        .status(statusCode.DEFAULT)
        .send({ message: "Error from get clothing item" });
    });
};

// //create method to perform update operation to update items in DB
// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;
//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail()
//     .then((item) => {
//       res.status(200).send({ data: item });
//     })
//     .catch((e) => {
//       res.status(500).send({ message: "Error from updateItem", e });
//       console.log(e);
//     });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove(itemId)
    .then(() => res.status(204).send({}))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError" || e.name === "CastError") {
        // send the error
        res.status(statusCode.BAD_REQUEST).send({
          message: `An unknown error "${e.name} "has occurred: ${e.message}`,
        });
      }
      res
        .status(statusCode.DEFAULT)
        .send({ message: "Error from delete item" });
    });
};

// like an item
const likeAnItem = (req, res) => {
  const userId = req.user._id;
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // add _id to the array if it's not there yet
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError" || e.name === "CastError") {
        // send the error
        res.status(statusCode.BAD_REQUEST).send({
          message: `An unknown error "${e.name} "has occurred: ${e.message}`,
        });
      }
      res.status(statusCode.DEFAULT).send({ message: "Error from likeAnItem" });
    });
};

// Dislike an item
const unlikeAnItem = (req, res) => {
  const userId = req.user._id;
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // remove _id from the array
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError" || e.name === "CastError") {
        // send the error
        res.status(statusCode.BAD_REQUEST).send({
          message: `An unknown error "${e.name} "has occurred: ${e.message}`,
        });
      }
      res.status(statusCode.DEFAULT).send({ message: "Error from likeAnItem" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeAnItem,
  unlikeAnItem,
};
