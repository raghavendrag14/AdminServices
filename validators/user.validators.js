const { body, param, validationResult } = require('express-validator');

/**
 * Validation rules based on models/user.js schema
 */
const createUserValidation = [
  body('username')
    .isString().withMessage('username must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('username must be 2-100 chars'),
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password min 8 chars')
    .matches(/[A-Z]/).withMessage('Include an uppercase letter')
    .matches(/[a-z]/).withMessage('Include a lowercase letter')
    .matches(/[0-9]/).withMessage('Include a number'),
  body('roleId')
    .isMongoId().withMessage('Valid roleId required'),
  // optional names (model has "firtName" typo — accept both to be safe)
  body('firstName').optional().isString().isLength({ min: 2, max: 100 }),
  body('lastName').optional().isString().isLength({ min: 2, max: 100 }),
  body('firtName').optional().isString().isLength({ min: 2, max: 100 }),
];

const updateUserValidation = [
  body('id').isMongoId().withMessage('Valid user id required'),
  body('username').optional().isString().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').optional()
    .isLength({ min: 8 }).withMessage('Password min 8 chars')
    .matches(/[A-Z]/).withMessage('Include an uppercase letter')
    .matches(/[a-z]/).withMessage('Include a lowercase letter')
    .matches(/[0-9]/).withMessage('Include a number'),
  body('roleId').optional().isMongoId().withMessage('Valid roleId required'),
  body('firstName').optional().isString().isLength({ min: 2, max: 100 }),
  body('lastName').optional().isString().isLength({ min: 2, max: 100 }),
  body('firtName').optional().isString().isLength({ min: 2, max: 100 }),
];

const idParamValidation = [
  param('id').isMongoId().withMessage('Valid id param required'),
];

/**
 * Run validation and return errors if any
 */
function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

module.exports = {
  createUserValidation,
  updateUserValidation,
  idParamValidation,
  runValidation,
};