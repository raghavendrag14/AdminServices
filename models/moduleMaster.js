const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// Dropdown Options Schema
const dropdownOptionSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },   // Text shown in UI
  value: { type: String, required: true, trim: true },   // Internal value
  isActive: { type: Boolean, default: true }             // For soft-disable
}, { _id: false });

// Dropdown Schema
const dropdownSchema = new mongoose.Schema({
  fieldName: { type: String, required: true, trim: true },   // e.g. "gender"
  displayName: { type: String, required: true, trim: true }, // e.g. "Gender"
  options: { type: [dropdownOptionSchema], default: [] }
}, { _id: false });

// Module Schema (holds dropdowns for each page/module)
const moduleSchema = new mongoose.Schema({
  moduleName: { type: String, required: true, trim: true, unique: true }, // e.g. "User Profile"
  moduleCode: { type: String, required: true, uppercase: true, unique: true }, // e.g. "USER_PROFILE"
  dropdowns: { type: [dropdownSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("ModuleMaster", moduleSchema);