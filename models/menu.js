const mongoose = require('mongoose');


const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  link: { type: String, trim: true, default: '' },
  submenu: { type: [], default: [] }
}, { _id: false });

// Self-reference after initial definition:
MenuItemSchema.add({
  submenu: [MenuItemSchema]
});
const MenuSchema = new mongoose.Schema({
  menu: { type: [MenuItemSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Menu', MenuSchema);