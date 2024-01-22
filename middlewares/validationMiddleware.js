// middleware/validation.js

const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateClothingItemBody = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),

      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    })
    .unknown(true),
});

const validateUserCreation = celebrate({
  body: Joi.object()
    .keys({
      userName: Joi.string().min(2).max(30).required(),
      userAvatar: Joi.string().uri().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
    .unknown(true),
});

const validateUserLogin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
    .unknown(true),
});

const validateId = celebrate({
  params: Joi.object()
    .keys({
      id: Joi.string().hex().length(24).required(),
    })
    .unknown(true),
});

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports = {
  validateClothingItemBody,
  validateUserCreation,
  validateUserLogin,
  validateId,
  validateURL,
};
