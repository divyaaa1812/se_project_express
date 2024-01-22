// create controllers
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const statusCode = require("../utils/constants");
const UnauthorizedError = require("../errors/unauthorizedError");
const ConflictError = require("../errors/conflictError");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  users
    .findOne({ email })
    .select("+password")
    .then((existingUser) => {
      if (existingUser) {
        // res
        //   .status(statusCode.DUPLICATE_RECORD)
        //   .send({ message: "This email already exists in Database" });
        next(new UnauthorizedError("This email already exists in Database"));
      } else {
        bcrypt.hash(password, 10).then((hash) =>
          users
            .create({ name, avatar, email, password: hash })
            .then((newUser) => {
              res
                .status(statusCode.SUCCESS)
                .send({ name, avatar, email, _id: newUser._id });
            })
            .catch((e) => {
              if (e.name && e.name === "ValidationError") {
                // return res
                //   .status(statusCode.BAD_REQUEST)
                //   .send({ message: "Bad Request" });
                next(new BadRequestError("ValidationError"));
              }
              return res
                .status(statusCode.DEFAULT)
                .send({ message: "Server Error" });
            }),
        );
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(statusCode.BAD_REQUEST)
          .send({ message: "Bad Request" });
      }
      return res.status(statusCode.DEFAULT).send({ message: "Server Error" });
    });
};

// controllers/users.js

const login = (req, res) => {
  const { email, password } = req.body;
  return users
    .findUserByCredentials(email, password)
    .then((registereduser) => {
      // create a token
      const token = jwt.sign({ _id: registereduser._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).send({ token });
    })
    .catch((e) => {
      if (e.message === "Incorrect email or password") {
        return res
          .status(statusCode.AUTHORIZATION_ERROR)
          .send({ message: "Authorization Error" });
      }
      return res.status(statusCode.DEFAULT).send({ message: "Server Error" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  users
    .findById(userId)
    .orFail()
    .then((currentuser) => {
      res.send(currentuser);
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(statusCode.NOT_FOUND).send({
          message: "User Not Found",
        });
      } else if (e.name === "CastError") {
        res.status(statusCode.BAD_REQUEST).send({
          message: "Invalid request.",
        });
      } else {
        res
          .status(statusCode.DEFAULT)
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
    .then((userupdate) => {
      res.send(userupdate);
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
      } else if (err.name === "ValidationError") {
        res.status(statusCode.BAD_REQUEST).send({
          message: "validation error.",
        });
      } else {
        res
          .status(statusCode.DEFAULT)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
