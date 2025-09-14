const controller = require("../middleware/role.middleware");
const Role = require("../models/role");
const express = require("express");
const { validationResult } = require("express-validator");
// ...existing code...
controller.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
controller.createRole = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        let parameters = req.body;
        if(parameters == null || parameters == undefined){
            return res.status(400).json({ message: 'No parameters provided' });
        }
        else if(!parameters.roleName || !parameters.roleCode || !parameters.privileges){
            return res.status(400).json({ message: 'roleName, roleCode and privileges are required' });
        }
        else{
        const existingRole = await Role.findOne( parameters.roleCode ? { roleCode: parameters.roleCode } : { roleName: parameters.roleName });
        if (existingRole) {
            return res.status(400).json({ message: 'Role name already exists' });
        }

        const role = new Role( {roleName: parameters.roleName,roleCode:parameters.roleCode,privileges: parameters.privileges });
        await role.save();
        res.status(201).json({ message: 'Role created', role });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
controller.updateRole = async (req, res) => {
    const errors = validationResult(req);   
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        let parameters = req.body;
        
        if(parameters == null || parameters == undefined){
            return res.status(400).json({ message: 'No parameters provided for update' });
        }   else    {
            const role = await Role.findById(parameters.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        if (parameters.roleName) role.roleName = parameters.roleName;
        if (parameters.roleCode) role.roleCode = parameters.roleCode;
        if (parameters.privileges) role.privileges = parameters.privileges;
        await role.save();
        res.json({ message: 'Role updated', role });
        }

        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
controller.deleteRole = async (req, res) => {
    const errors = validationResult(req);   
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {   
        let parameters = req.body;
        const role = await Role.findById(parameters.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        await Role.deleteOne({ _id: parameters.id });
        res.json({ message: 'Role deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }   
}   

module.exports = controller;