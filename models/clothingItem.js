const mongoose = require("mongoose");
const validator = require("validator");

//define clothing item schema
const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["cold", "hot", "warm"],
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Link is not valid",
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
    ref: "user",
  },
  likes: [
    {
      type: mongoose.ObjectId,
      ref: "user", // Replace 'User' with the actual name of the user model
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingitems", clothingItem);
