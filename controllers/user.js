// create controllers
const user = require("../models/user");
const users = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const statusCode = require("../utils/constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const { name, avatar, email, password } = req.body;
  users
    .findOne({ email })
    .select("+password")
    .then((existingUser) => {
      console.log(existingUser);
      if (existingUser) {
        res
          .status(statusCode.DUPLICATE_RECORD)
          .send({ message: "This email already exists in Database" });
      } else {
        bcrypt.hash(req.body.password, 10).then((hash) =>
          users
            .create({ name, avatar, email, password: hash })
            .then((newUser) => {
              console.log(newUser);
              res
                .status(statusCode.SUCCESS)
                .send({ name, avatar, email, _id: user._id });
            })
            .catch((e) => {
              console.error(e);
              if (e.name && e.name === "ValidationError") {
                return res
                  .status(statusCode.BAD_REQUEST)
                  .send({ message: "Bad Request" });
              }
              console.log("throwing a server error");
              return res
                .status(statusCode.DEFAULT)
                .send({ message: "Server Error" });
            }),
        );
      }
    });
};

// controllers/users.js

const login = (req, res) => {
  const { email, password } = req.body;
  return users
    .findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      console.log(user);
      console.log(JWT_SECRET);
      //create a token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).send({ token });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "Validation Error") {
        return res
          .status(statusCode.AUTHORIZATION_ERROR)
          .send({ message: "Authorization Error" });
      }
      console.log("throwing a server error");
      return res.status(statusCode.DEFAULT).send({ message: "Server Error" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  user
    .findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      if (err.name === "DocumentNotFoundError") {
        res.status(statusCode.NOT_FOUND).send({
          message: "User Not Found",
        });
      } else if (err.name === "CastError") {
        res.status(statusCode.BAD_REQUEST).send({
          message: "Invalid request.",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  users
    .findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(statusCode.NOT_FOUND).send({
          message: "No records",
        });
      } else if (err.name === "CastError") {
        res.status(statusCode.BAD_REQUEST).send({
          message: "Invalid Request data.",
        });
      } else if (err.name === "ValidatorError") {
        res.status(statusCode.BAD_REQUEST).send({
          message: "validation error.",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
