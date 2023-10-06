//create controllers
const users = require("../models/user");

//create method to perform get/post/put operation to add new items to DB

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
  if (!users[req.params.id]) {
    res.send(`This user doesn't exist`);
    return;
  }
  next(); // call the next function
};

const getUser = (req, res) => {
  const { name, avatar } = users[req.params.id];
  res.send(`User ${name}, with image - ${avatar}`);
};

const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  //extract data from body request
  const { name, avatar } = req.body;

  users
    .create({ name, avatar })
    .then((data) => {
      console.log(data);
      res.send({ data: item }); //sending back data in response
    })
    .catch((e) => {
      res.status(500).send({ message: "Error adding user", e });
    });
};

module.exports = { getUsers, doesUserExist, getUser, createUser };
