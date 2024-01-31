// create controllers
const ClothingItem = require("../models/clothingItem");
const statusCode = require("../utils/constants");
const BadRequestError = require("../errors/badrequestError");
const NotFoundError = require("../errors/notfoundError");
const ForbiddenError = require("../errors/forbiddenError");

// create method to perform post operation to add new items to DB
const addItem = (req, res, next) => {
  // extract data from body request
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid request data"));
      } else {
        next(e);
      }
    });
};

// create method to perform get operation to retrieve items from DB
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => {
      res.send(items);
    })
    .catch((e) => {
      next(e);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      // If logged in user is not owner of the clothing item
      if (userId !== item.owner.toString()) {
        next(new ForbiddenError("No Access to perform this action"));
      }
      // else find by item id and delete
      return ClothingItem.findByIdAndDelete(itemId)
        .orFail()
        .then(() => {
          res.status(statusCode.SUCCESS).send({ message: "200 Ok" });
        });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not Found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("CastError"));
      } else {
        next(e);
      }
    });
};

// like an item
const likeAnItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // add _id to the array if it's not there yet
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new BadRequestError("CastError"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not Found"));
      } else {
        next(e);
      }
    });
};

// Dislike an item
const unlikeAnItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // remove _id from the array
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new BadRequestError("CastError"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not Found"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  addItem,
  getItems,
  deleteItem,
  likeAnItem,
  unlikeAnItem,
};
