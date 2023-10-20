// create controllers
const user = require("../models/user");
const users = require("../models/user");
const statusCode = require("../utils/constants");
const bcrypt = require("bcrypt");

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
  console.log(req);
  console.log(req.body);
  const { name, avatar, email, password } = req.body;
  users.findOne({ email }).then((existingUser) => {
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

const login = (req, res) => {
  const { email, password } = req.body;
  return users
    .findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
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
  const { _id: userId } = req.user;
  user
    .findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      handleHttpError(req, res, err);
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
      res.send({ data: user });
    })
    .catch((err) => {
      handleHttpError(req, res, err);
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
