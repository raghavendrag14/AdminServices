const ModuleMaster = require("../models/moduleMaster.js");  // <-- your mongoose schema
// ...existing code...
const controller = require("../middleware/modulemaster.middleware");
const express = require("express");
const { validationResult } = require("express-validator");
// Create Module
controller.createModule = async (req, res) => {
  try {
    const { moduleName, moduleCode } = req.body;
    if (!moduleName || !moduleCode) {
      return res.status(400).json({ error: "moduleName and moduleCode required" });
    }

    const module = await ModuleMaster.create({ moduleName, moduleCode });
    res.status(201).json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Module
controller.updateModule = async (req, res) => {
  try {
    const { moduleId, ...updateData } = req.body;
    if (!moduleId) return res.status(400).json({ error: "moduleId required" });

    const module = await ModuleMaster.findByIdAndUpdate(moduleId, updateData, { new: true });
    if (!module) return res.status(404).json({ error: "Module not found" });

    res.json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Module
controller.deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.body;
    if (!moduleId) return res.status(400).json({ error: "moduleId required" });

    const module = await ModuleMaster.findByIdAndDelete(moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Modules
controller.getAllModules = async (req, res) => {
  try {
    const modules = await ModuleMaster.find({});
    res.json(modules);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create Dropdown
controller.createDropdown = async (req, res) => {
  try {
    const { moduleId, fieldName, displayName } = req.body;
    if (!moduleId || !fieldName || !displayName) {
      return res.status(400).json({ error: "moduleId, fieldName, displayName required" });
    }

    const module = await ModuleMaster.findById(moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    if (module.dropdowns.some(d => d.fieldName === fieldName)) {
      return res.status(400).json({ error: "Dropdown with this fieldName already exists" });
    }

    module.dropdowns.push({ fieldName, displayName, options: [] });
    await module.save();

    res.json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Dropdown
controller.updateDropdown = async (req, res) => {
  try {
    const { moduleId, fieldName, displayName } = req.body;
    if (!moduleId || !fieldName) {
      return res.status(400).json({ error: "moduleId and fieldName required" });
    }

    const module = await ModuleMaster.findById(moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    const dropdown = module.dropdowns.find(d => d.fieldName === fieldName);
    if (!dropdown) return res.status(404).json({ error: "Dropdown not found" });

    if (displayName) dropdown.displayName = displayName;

    await module.save();
    res.json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Dropdown
controller.deleteDropdown = async (req, res) => {
  try {
    const { moduleId, fieldName } = req.body;
    if (!moduleId || !fieldName) {
      return res.status(400).json({ error: "moduleId and fieldName required" });
    }

    const module = await ModuleMaster.findById(moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    module.dropdowns = module.dropdowns.filter(d => d.fieldName !== fieldName);
    await module.save();

    res.json({ message: "Dropdown deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create Option
controller.createOption = async (req, res) => {
  try {
    const { moduleId, fieldName, label, value } = req.body;
    if (!moduleId || !fieldName || !label || !value) {
      return res.status(400).json({ error: "moduleId, fieldName, label, value required" });
    }

    const module = await ModuleMaster.findById(moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    const dropdown = module.dropdowns.find(d => d.fieldName === fieldName);
    if (!dropdown) return res.status(404).json({ error: "Dropdown not found" });

    if (dropdown.options.some(opt => opt.value === value)) {
      return res.status(400).json({ error: "Option with this value already exists" });
    }

    dropdown.options.push({ label, value });
    await module.save();

    res.json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Option
controller.updateOption = async (req, res) => {
  try {
    const { moduleId, fieldName, value, label, isActive } = req.body;
    if (!moduleId || !fieldName || !value) {
      return res.status(400).json({ error: "moduleId, fieldName, and value required" });
    }

    const module = await ModuleMaster.findById(moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    const dropdown = module.dropdowns.find(d => d.fieldName === fieldName);
    if (!dropdown) return res.status(404).json({ error: "Dropdown not found" });

    const option = dropdown.options.find(opt => opt.value === value);
    if (!option) return res.status(404).json({ error: "Option not found" });

    if (label) option.label = label;
    if (typeof isActive === "boolean") option.isActive = isActive;

    await module.save();
    res.json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Option
controller.deleteOption = async (req, res) => {
  try {
    const { moduleId, fieldName, value } = req.body;
    if (!moduleId || !fieldName || !value) {
      return res.status(400).json({ error: "moduleId, fieldName, value required" });
    }

    const module = await ModuleMaster.findById(moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    const dropdown = module.dropdowns.find(d => d.fieldName === fieldName);
    if (!dropdown) return res.status(404).json({ error: "Dropdown not found" });

    dropdown.options = dropdown.options.filter(opt => opt.value !== value);
    await module.save();

    res.json({ message: "Option deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = controller;
// ...existing code...

// Route bindings using controller functions

// Export router