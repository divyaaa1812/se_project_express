const mongoose = require("mongoose");
const validator = require("validator");

// define clothing item schema
const clothingitems = new mongoose.Schema({
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
    lowercase: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Link is not valid",
    },
  },
  owner: {
    required: true,
    type: mongoose.ObjectId,
    ref: "user",
  },
  likes: [
    {
      type: mongoose.ObjectId,
      ref: "user",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingitems", clothingitems);
