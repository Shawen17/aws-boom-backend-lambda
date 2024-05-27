const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().required(),
});

module.exports = loginSchema;
