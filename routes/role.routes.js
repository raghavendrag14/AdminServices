const express = require("express");
const { validationResult } = require("express-validator");
// ...existing code...
const  auth  = require("../middleware/auth.middleware");
// ...existing code...
const { updateMeValidation } = require("../validators/auth.validators");
const Role = require("../models/role");
const controller = require("../middleware/role.middleware");

const router = express.Router();

router.get('/', auth.authentication,controller.getAllRoles);
router.post('/createAdminRole',controller.createRole);

router.post('/createRole', auth.authentication,controller.createRole);
router.post('/UpdateRole',auth.authentication, controller.updateRole);
router.post('/deleteRole',auth.authentication, controller.deleteRole);
module.exports = router;
