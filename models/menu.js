const mongoose = require('mongoose');

const MenuSubItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  link: { type: String, trim: true, default: '' },
  // allow deeper nesting (optional). Use Mixed if arbitrary depth is needed.
  submenu: [
    {
      name: { type: String, required: true, trim: true },
      link: { type: String, trim: true, default: '' },
    }
  ]
}, { _id: false });

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  link: { type: String, trim: true, default: '' },
  submenu: { type: [MenuSubItemSchema], default: [] }
}, { _id: false });

const MenuSchema = new mongoose.Schema({
  menu: { type: [MenuItemSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Menu', MenuSchema);