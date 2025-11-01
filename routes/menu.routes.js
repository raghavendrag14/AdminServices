const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();
const  auth  = require("../middleware/auth.middleware");
const { createMenuValidation, updateMenuValidation, validateMenuStructure } = require("../validators/menu.validator");

const controller = require("../middleware/menu.middleware");
router.get('/getAllMenu', auth.authentication, controller.getAllMenu); 
module.exports = router;