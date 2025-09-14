const { body } = require("express-validator");

const loginValidation = [
  body("username").isString().normalizeEmail(),
  body("password").isString().isLength({ min: 8 }),
];


module.exports = { loginValidation };
