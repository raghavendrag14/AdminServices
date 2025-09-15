const express = require("express");
const { validationResult } = require("express-validator");
const controller = require("../middleware/modulemaster.middleware") ;
const auth = require("../middleware/auth.middleware");
const checkPermission = require('../middleware/checkPermission');
const validator = require("../middleware/modulemaster.validator");

// <-- your mongoose schema

const router = express.Router();


router.post("/modules/create", controller.createModule);
router.put("/modules/update", controller.updateModule);
router.delete("/modules/delete", controller.deleteModule);
router.get("/modules/all", controller.getAllModules);

router.post("/dropdowns/create", controller.createDropdown);
router.put("/dropdowns/update", controller.updateDropdown);
router.delete("/dropdowns/delete", controller.deleteDropdown);

router.post("/options/create", controller.createOption);
router.put("/options/update", controller.updateOption);
router.delete("/options/delete", controller.deleteOption);
    
module.exports = router;
