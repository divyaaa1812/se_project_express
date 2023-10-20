// create controllers
const users = require("../models/user");
const statusCode = require("../utils/constants");
const bcrypt = require("bcryptjs");

// create methods to perform get/post/put operation to add new items to DB
const getUsers = (req, res) => {
  users
    .find()
    .then((data) => {
      res.send({ data });
    })
    .catch(() => {
      res.status(statusCode.DEFAULT).send({ message: "Error fetching users" });
    });
};

// // check whether the user exists
// const doesUserExist = (req, res, next) => {
//   const userId = req._id;
//   if (!userId) {
//     res.send(`This user doesn't exist`);
//     return;
//   }
//   next(); // call the next function
// };

const getUserById = (req, res) => {
  const { userId } = req.params;
  users
    .findById(userId)
    .orFail()
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        // send the error
        res.status(statusCode.NOT_FOUND).send({
          message: "Not found",
        });
      } else if (e.name === "CastError") {
        res.status(statusCode.BAD_REQUEST).send({
          message: "cast error",
        });
      } else {
        res
          .status(statusCode.DEFAULT)
          .send({ message: "Error fetching users" });
      }
    });
};

const createUser = (req, res) => {
  // extract data from body request
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      users
        .findOne(email)
        .orFail()
        .create({ name, avatar, email, password: hash })
        .then((data) => {
          // sending back data in response
          res.send({ data });
        }),
    )
    // .throw((e) => {
    //   res
    //     .status(statusCode.DUPLICATE_RECORD)
    //     .send({ message: "Email already exists" });
    // })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(statusCode.BAD_REQUEST).send({
          message: "Invalid data",
        });
      } else {
        res.status(statusCode.DEFAULT).send({ message: "Error adding user" });
      }
    });
};

module.exports = { getUsers, getUserById, createUser };
