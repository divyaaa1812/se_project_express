// create controllers
const ClothingItem = require("../models/clothingItem");
const statusCode = require("../utils/constants");
const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const ForbiddenError = require("../errors/forBiddenError");

// create method to perform post operation to add new items to DB
const addItem = (req, res) => {
  // extract data from body request
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid request data"));
      } else {
        next(err);
      }
    });
  // .catch((e) => {
  //   console.log(e);
  //   if (e.name === "ValidationError") {
  //     res.status(statusCode.BAD_REQUEST).send({
  //       message: `Invalid request data`,
  //     });
  //   } else {
  //     res.status(statusCode.DEFAULT).send({ message: "Error adding item" });
  //   }
  // });
};

// create method to perform get operation to retrieve items from DB
const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => res.send(items))
    .catch((e) => {
      // res
      //   .status(statusCode.DEFAULT)
      //   .send({ message: "Error from get clothing item" });
      next(err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      // If logged in user is not owner of the clothing item
      if (userId !== item.owner.toString()) {
        return res
          .status(statusCode.FORBIDDEN)
          .send({ message: "No Access to perform this action" });
        // next(new ForbiddenError("No Access to perform this action"));
      }
      // else find by item id and delete
      ClothingItem.findByIdAndDelete(itemId)
        .orFail()
        .then(() => {
          res.status(statusCode.SUCCESS).send({ message: "200 Ok" });
        })
        .catch((err) => {
          if (err.name === "DocumentNotFoundError") {
            next(new NotFoundError("Not Found"));
          } else if (err.name === "CastError") {
            next(new BadRequestError("CastError"));
          } else {
            next(err);
          }
        })
        //     .catch((err) => {
        //       if (err.name === "DocumentNotFoundError") {
        //         // send the error
        //         res.status(statusCode.NOT_FOUND).send({
        //           message: "Not found",
        //         });
        //       } else if (err.name === "CastError") {
        //         res.status(statusCode.BAD_REQUEST).send({
        //           message: "CastError",
        //         });
        //       } else {
        //         res
        //           .status(statusCode.DEFAULT)
        //           .send({ message: "Error from delete item" });
        //       }
        //     });
        // })
        .catch((e) => {
          if (e.name === "DocumentNotFoundError") {
            // send the error
            // res.status(statusCode.NOT_FOUND).send({
            //   message: "Not found",
            // });
            next(new NotFoundError("Not Found"));
          } else if (e.name === "CastError") {
            // res.status(statusCode.BAD_REQUEST).send({
            //   message: "CastError",
            // });
            next(new BadRequestError("CastError"));
          }
        });
    });
};

// like an item
const likeAnItem = (req, res) => {
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
    .catch((err) => {
      if (err.name === "CastError") {
        // send the error
        // res.status(statusCode.BAD_REQUEST).send({
        //   message: "Cast error",
        // });
        next(new BadRequestError("CastError"));
      } else if (err.name === "DocumentNotFoundError") {
        // res.status(statusCode.NOT_FOUND).send({
        //   message: "Not found",
        // });
        next(new NotFoundError("Not Found"));
      } else {
        // res
        //   .status(statusCode.DEFAULT)
        //   .send({ message: "Error from likeAnItem" });
        next(err);
      }
    });
};

// Dislike an item
const unlikeAnItem = (req, res) => {
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
    .catch((err) => {
      if (err.name === "CastError") {
        // send the error
        // res.status(statusCode.BAD_REQUEST).send({
        //   message: "cast error",
        // });
        next(new BadRequestError("CastError"));
      } else if (err.name === "DocumentNotFoundError") {
        // res.status(statusCode.NOT_FOUND).send({
        //   message: "Not Found",
        // });
        next(new NotFoundError("Not Found"));
      } else {
        // res
        //   .status(statusCode.DEFAULT)
        //   .send({ message: "Error from likeAnItem" });
        next(err);
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
