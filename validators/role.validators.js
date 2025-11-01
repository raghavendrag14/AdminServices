const { body, param, validationResult } = require('express-validator');

const createRoleValidation = [
  body('roleName').isString().trim().isLength({ min: 3, max: 50 }).withMessage('roleName is required (3-50 chars)'),
  body('roleCode').isString().trim().isLength({ min: 2, max: 20 }).matches(/^[A-Z_]+$/).withMessage('roleCode is required and must be uppercase letters/underscores'),
  body('privileges').isArray({ min: 1 }).withMessage('privileges must be a non-empty array'),
  body('privileges.*').isMongoId().withMessage('privileges must contain valid privilege ids')
];

const updateRoleValidation = [
  body('id').isMongoId().withMessage('Valid role id is required'),
  body('roleName').optional().isString().trim().isLength({ min: 3, max: 50 }),
  body('roleCode').optional().isString().trim().isLength({ min: 2, max: 20 }).matches(/^[A-Z_]+$/),
  body('privileges').optional().isArray({ min: 1 }),
  body('privileges.*').optional().isMongoId()
];

const idParamValidation = [
  param('id').isMongoId().withMessage('Valid id param required')
];

function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

module.exports = {
  createRoleValidation,
  updateRoleValidation,
  idParamValidation,
  runValidation
};
