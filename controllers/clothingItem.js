//create controllers

const ClothingItem = require("../models/clothingitem");

//create method to perform post operation to add new items to DB

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  //extract data from body request
  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weatherType, imageURL })
    .then((data) => {
      console.log(data);
      res.send({ data: item }); //sending back data in response
    })
    .catch((e) => {
      res.status(500).send({ message: "Error adding item", e });
    });
};

module.exports = { createItem };
