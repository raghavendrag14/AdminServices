// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    roleCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    privileges: [
      {
        type: String,
        required: true,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Role', roleSchema);
