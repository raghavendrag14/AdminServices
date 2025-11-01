const { body, param, validationResult } = require('express-validator');

// Basic top-level express-validator rules (don't attempt to validate nested
// submenu items here — we'll validate nesting with a recursive middleware).
const menuItemRules = [
  body('menu').isArray({ min: 1 }).withMessage('menu must be a non-empty array'),
  body('menu.*.name').isString().trim().notEmpty().withMessage('menu[].name is required'),
  body('menu.*.link').optional().isString().withMessage('menu[].link must be a string')
];

const updateMenuValidation = [
  param('id').optional().isMongoId().withMessage('Valid menu id required'),
  ...menuItemRules
];

const createMenuValidation = [
  ...menuItemRules
];

// Recursive validator middleware for nested menu items. This walks the
// `req.body.menu` tree and builds an errors array in the same shape as
// express-validator's `validationResult().array()` so callers can return a
// consistent response shape.
function validateMenuStructure(req, res, next) {
  const errors = [];

  const checkItem = (item, path) => {
    // item must be an object
    if (typeof item !== 'object' || item === null) {
      errors.push({ msg: `${path} must be an object`, param: path, location: 'body' });
      return;
    }

    // name required string
    if (typeof item.name !== 'string' || item.name.trim() === '') {
      errors.push({ msg: `${path}.name is required`, param: `${path}.name`, location: 'body' });
    }

    // link optional string
    if (item.link !== undefined && typeof item.link !== 'string') {
      errors.push({ msg: `${path}.link must be a string`, param: `${path}.link`, location: 'body' });
    }

    // submenu optional array; if present recurse
    if (item.submenu !== undefined) {
      if (!Array.isArray(item.submenu)) {
        errors.push({ msg: `${path}.submenu must be an array`, param: `${path}.submenu`, location: 'body' });
      } else {
        item.submenu.forEach((child, idx) => checkItem(child, `${path}.submenu[${idx}]`));
      }
    }
  };

  if (!Array.isArray(req.body.menu)) return next();

  req.body.menu.forEach((it, idx) => checkItem(it, `menu[${idx}]`));

  if (errors.length) return res.status(400).json({ errors });
  return next();
}

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
  validateMenuStructure,
};