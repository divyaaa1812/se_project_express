// create controllers
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const statusCode = require("../utils/constants");
const UnauthorizedError = require("../errors/unauthorizederror");
const BadRequestError = require("../errors/badrequesterror");
const NotFoundError = require("../errors/notfounderror");
const ConflictError = require("../errors/conflicterror");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  users
    .findOne({ email })
    .select("+password")
    .then((existingUser) => {
      if (existingUser) {
        next(new ConflictError("This email already exists in Database"));
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
              if (e.name === "ValidationError") {
                next(new BadRequestError(e.message));
              }
              next(e);
            }),
        );
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError(e.message));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
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
        next(new UnauthorizedError("Invalid login"));
      } else {
        next(e);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  users
    .findById(userId)
    .orFail()
    .then((currentuser) => {
      res.send(currentuser);
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid request"));
      } else {
        next(e);
      }
    });
};

const updateUser = (req, res, next) => {
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
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("No records"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid request"));
      } else if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid request"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
