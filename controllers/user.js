// create controllers
const users = require("../models/user");
const statusCode = require("../utils/constants");

// create methods to perform get/post/put operation to add new items to DB
const getUsers = (req, res) => {
  users
    .find()
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
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
      res.status(statusCode.DEFAULT).send({ message: "Error fetching users" });
    });
};

const createUser = (req, res) => {
  // extract data from body request
  const { name, avatar } = req.body;
  users
    .create({ name, avatar })
    .then((data) => {
      // sending back data in response
      res.send({ data });
    })
    .catch((e) => {
      res.status(statusCode.DEFAULT).send({ message: "Error adding user" });
    });
};

module.exports = { getUsers, getUserById, createUser };
