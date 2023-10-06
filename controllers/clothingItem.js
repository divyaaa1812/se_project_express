//create controllers

const ClothingItem = require("../models/clothingItem");

//create method to perform post operation to add new items to DB
const createItem = (req, res) => {
  //extract data from body request
  const author = req.user._id;
  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL, owner: author })
    .then((data) => {
      console.log(data);
      res.send({ item: data }); //sending back data in response
    })
    .catch((e) => {
      res.status(500).send({ message: "Error adding item", e });
      console.log(e);
    });
};

//create method to perform get operation to retrieve items from DB
const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from get closthing item", e });
    });
};

//create method to perform update operation to update items in DB
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from updateItem", e });
      console.log(e);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndRemove(itemId)
    .then(() => res.status(204).send({}))
    .catch((e) => {
      res.status(500).send({ message: "Error from delete item", e }),
        console.log(e);
    });
};

//like an item
const likeAnItem = (req, res) => {
  const userId = req.user._id;
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from likeAnItem", e });
      console.log(e);
    });
};

//Dislike an item
const unlikeAnItem = (req, res) => {
  const userId = req.user._id;
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from likeAnItem", e });
      console.log(e);
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeAnItem,
  unlikeAnItem,
};
