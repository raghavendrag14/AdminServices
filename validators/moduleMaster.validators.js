const { body, validationResult } = require("express-validator");

// Validation result handler
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

const createModule = [
  body("moduleName").exists().withMessage("moduleName is required").bail()
    .isString().withMessage("moduleName must be a string").trim().notEmpty(),
  body("moduleCode").exists().withMessage("moduleCode is required").bail()
    .isString().withMessage("moduleCode must be a string").trim().notEmpty()
    .matches(/^[A-Z0-9_]+$/).withMessage("moduleCode must be alphanumeric/underscore (uppercase)")
    .customSanitizer(v => String(v).toUpperCase()),
  runValidation
];

const updateModule = [
  body("moduleId").exists().withMessage("moduleId is required").bail()
    .isMongoId().withMessage("moduleId must be a valid Mongo id"),
  body("moduleName").optional().isString().trim().notEmpty(),
  body("moduleCode").optional().isString().trim().notEmpty()
    .matches(/^[A-Z0-9_]+$/).withMessage("moduleCode must be alphanumeric/underscore (uppercase)")
    .customSanitizer(v => String(v).toUpperCase()),
  runValidation
];

const deleteModule = [
  body("moduleId").exists().withMessage("moduleId is required").bail()
    .isMongoId().withMessage("moduleId must be a valid Mongo id"),
  runValidation
];

const createDropdown = [
  body("moduleId").exists().withMessage("moduleId is required").bail()
    .isMongoId().withMessage("moduleId must be a valid Mongo id"),
  body("fieldName").exists().withMessage("fieldName is required").bail()
    .isString().trim().notEmpty(),
  body("displayName").exists().withMessage("displayName is required").bail()
    .isString().trim().notEmpty(),
  runValidation
];

const updateDropdown = [
  body("moduleId").exists().withMessage("moduleId is required").bail()
    .isMongoId().withMessage("moduleId must be a valid Mongo id"),
  body("fieldName").exists().withMessage("fieldName is required").bail()
    .isString().trim().notEmpty(),
  body("displayName").optional().isString().trim().notEmpty(),
  runValidation
];

const deleteDropdown = [
  body("moduleId").exists().withMessage("moduleId is required").bail()
    .isMongoId().withMessage("moduleId must be a valid Mongo id"),
  body("fieldName").exists().withMessage("fieldName is required").bail()
    .isString().trim().notEmpty(),
  runValidation
];

const createOption = [
  body("moduleId").exists().withMessage("moduleId is required").bail()
    .isMongoId().withMessage("moduleId must be a valid Mongo id"),
  body("fieldName").exists().withMessage("fieldName is required").bail()
    .isString().trim().notEmpty(),
  body("label").exists().withMessage("label is required").bail()
    .isString().trim().notEmpty(),
  body("value").exists().withMessage("value is required").bail()
    .isString().trim().notEmpty(),
  runValidation
];

const updateOption = [
  body("moduleId").exists().withMessage("moduleId is required").bail()
    .isMongoId().withMessage("moduleId must be a valid Mongo id"),
  body("fieldName").exists().withMessage("fieldName is required").bail()
    .isString().trim().notEmpty(),
  body("value").exists().withMessage("value is required").bail()
    .isString().trim().notEmpty(),
  body("label").optional().isString().trim().notEmpty(),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
  runValidation
];

const deleteOption = [
  body("moduleId").exists().withMessage("moduleId is required").bail()
    .isMongoId().withMessage("moduleId must be a valid Mongo id"),
  body("fieldName").exists().withMessage("fieldName is required").bail()
    .isString().trim().notEmpty(),
  body("value").exists().withMessage("value is required").bail()
    .isString().trim().notEmpty(),
  runValidation
];

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  createDropdown,
  updateDropdown,
  deleteDropdown,
  createOption,
  updateOption,
  deleteOption,
  runValidation
};