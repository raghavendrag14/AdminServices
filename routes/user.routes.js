const express = require("express");
const { validationResult } = require("express-validator");
// ...existing code...
// ...existing code...
const { updateMeValidation } = require("../validators/auth.validators");
const User = require("../models/user");
const checkPermission = require('../middleware/checkPermission');
const controller = require("../middleware/user.middleware");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  createUserValidation,
  updateUserValidation,
  idParamValidation,
  runValidation,
} = require('../validators/user.validators');

router.post('/createAdminUser',createUserValidation, // validation rules
  runValidation,       controller.createUser);
router.get('/getAllUsers', auth.authentication, checkPermission('viewUsers'), controller.getUsers); 
router.get('/getUserById/:id',auth.authentication, checkPermission('viewUsers'), controller.getUserById);

router.post('/createUser',auth.authentication, checkPermission('createUser'),createUserValidation, // validation rules
  runValidation,       controller.createUser);
router.post('/updateUser',auth.authentication, checkPermission('editUser'),updateUserValidation,
  runValidation, controller.updateUser); 
router.post('/deleteUser',auth.authentication, checkPermission('deleteUser'), controller.deleteUser);


module.exports = router;
