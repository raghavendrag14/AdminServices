const { body, param, validationResult } = require('express-validator');

const menuItemRules = [
  body('menu').isArray({ min: 1 }).withMessage('menu must be a non-empty array'),
  body('menu.*.name').isString().trim().notEmpty().withMessage('menu[].name is required'),
  body('menu.*.link').optional().isString().withMessage('menu[].link must be a string'),
  body('menu.*.submenu').optional().isArray().withMessage('menu[].submenu must be an array'),
  body('menu.*.submenu.*.name').if(body('menu.*.submenu').exists()).isString().trim().notEmpty().withMessage('menu[].submenu[].name is required'),
  body('menu.*.submenu.*.link').optional().isString().withMessage('menu[].submenu[].link must be a string'),
];

const updateMenuValidation = [
  param('id').optional().isMongoId().withMessage('Valid menu id required'),
  ...menuItemRules
];

const createMenuValidation = [
  ...menuItemRules
];

const idParamValidation = [
  param('id').isMongoId().withMessage('Valid id param required'),
];

function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

module.exports = {
  createMenuValidation,
  updateMenuValidation,
  idParamValidation,
  runValidation,
};