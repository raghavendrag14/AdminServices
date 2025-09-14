const express = require("express");
const { validationResult } = require("express-validator");

router.get('/getAllUsers', auth.authentication, controller.getAllMenu); 
