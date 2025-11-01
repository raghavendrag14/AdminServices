const mongoose = require('mongoose');

const privilegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Privilege', privilegeSchema);
