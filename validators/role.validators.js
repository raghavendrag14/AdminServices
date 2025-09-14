const { body } = require("express-validator");
// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Role name must be at least 3 characters long'],
      maxlength: [50, 'Role name cannot exceed 50 characters']
    },
    roleCode: {
      type: String,
      required: [true, 'Role code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [2, 'Role code must be at least 2 characters'],
      maxlength: [20, 'Role code cannot exceed 20 characters'],
      match: [/^[A-Z_]+$/, 'Role code must be uppercase letters and underscores only']
    },
    privileges: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0; // at least one privilege required
        },
        message: 'At least one privilege must be assigned'
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
