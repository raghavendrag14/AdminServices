const mongoose = require('mongoose');
const { Schema } = mongoose;

const OptionSchema = new Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true },
}, { _id: false });

const FieldDetailSchema = new Schema({
  id: { type: Number, required: true },
  code: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  defaultvalue: { type: String, default: '' }, // matches JSON key
  options: { type: [OptionSchema], default: [] },
}, { _id: false });

const FieldModuleSchema = new Schema({
  label: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true, uppercase: true },
  fieldDetails: { type: [FieldDetailSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('FieldModule', FieldModuleSchema);