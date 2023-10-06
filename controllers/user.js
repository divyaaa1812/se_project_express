//create controllers
const users = require("../models/user");

//create methods to perform get/post/put operation to add new items to DB
const getUsers = (req, res) => {
  users
    .find()
    .then((data) => {
      res.send({ data }); //sending back data in response
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: "Error fetching users", e });
    });
};

// check whether the user exists
const doesUserExist = (req, res, next) => {
  const userId = req._id;
  if (!userId) {
    res.send(`This user doesn't exist`);
    return;
  }
  next(); // call the next function
};
const getUserById = (req, res) => {
  const { userId } = req.params;
  users
    .findById(userId)
    .orFail()
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error fetching users", e });
      console.log(e);
    });
};

const createUser = (req, res) => {
  //extract data from body request
  const { name, avatar } = req.body;
  users
    .create({ name, avatar })
    .then((data) => {
      res.send({ data }); //sending back data in response
    })
    .catch((e) => {
      res.status(500).send({ message: "Error adding user", e });
      console.log(e);
    });
};

module.exports = { getUsers, doesUserExist, getUserById, createUser };
