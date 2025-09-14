const express = require("express");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const {  loginValidation } = require("../validators/auth.validators");
const User = require("../models/user");
const controller = require("../middleware/auth.middleware");

const router = express.Router();



router.post('/', loginValidation, controller.login);

router.post('/refreshToken', controller.refreshToken)


module.exports = router;
