const { body, param, validationResult } = require('express-validator');

const optionRules = [
  body('fieldDetails.*.options').optional().isArray(),
  body('fieldDetails.*.options.*.id').isInt().withMessage('option.id must be an integer'),
  body('fieldDetails.*.options.*.label').isString().trim().notEmpty().withMessage('option.label required'),
  body('fieldDetails.*.options.*.value').isString().trim().notEmpty().withMessage('option.value required'),
];

const fieldDetailRules = [
  body('fieldDetails').isArray({ min: 1 }).withMessage('fieldDetails must be a non-empty array'),
  body('fieldDetails.*.id').isInt().withMessage('fieldDetails[].id must be an integer'),
  body('fieldDetails.*.code').isString().trim().notEmpty().withMessage('fieldDetails[].code required'),
  body('fieldDetails.*.label').isString().trim().notEmpty().withMessage('fieldDetails[].label required'),
  body('fieldDetails.*.defaultvalue').optional().isString().withMessage('fieldDetails[].defaultvalue must be string'),
  ...optionRules,
];

const createFieldModuleValidation = [
  body('label').isString().trim().notEmpty().withMessage('label is required'),
  body('code').isString().trim().notEmpty().withMessage('code is required'),
  ...fieldDetailRules,
];

const updateFieldModuleValidation = [
  body('id').optional().isMongoId().withMessage('valid id required'),
  body('label').optional().isString().trim().notEmpty(),
  body('code').optional().isString().trim().notEmpty(),
  // when updating fieldDetails allow empty array but validate items if present
  body('fieldDetails').optional().isArray(),
  body('fieldDetails.*.id').optional().isInt(),
  body('fieldDetails.*.code').optional().isString().trim().notEmpty(),
  body('fieldDetails.*.label').optional().isString().trim().notEmpty(),
  body('fieldDetails.*.defaultvalue').optional().isString(),
  ...optionRules,
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
  createFieldModuleValidation,
  updateFieldModuleValidation,
  idParamValidation,
  runValidation,
};