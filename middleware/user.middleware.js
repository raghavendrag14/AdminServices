const jwt = require("jsonwebtoken");
const userdetails = require("../middleware/auth.middleware");
const User = require("../models/user");
const { validationResult } = require("express-validator");

userdetails.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        let parameters = req.body;
        const existingUser = await User.findOne({ $or: [{ username : parameters?.username }, { email:parameters.email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' }); // <-- return added
        }

        const user = new User({ username:parameters.username, email:parameters.email, password:parameters.password, roleId:parameters.roleId });
        await user.save();
        return res.status(201).json({ message: 'User created', user: { id: user._id, username: user.username, email: user.email, roleId: user.roleId } }); // <-- return added
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' }); // <-- return added
    }
};

userdetails.getUsers = async (req, res) => {
    try {   
        const users = await User.find().select("-password");
        return res.json({ users }); // return added
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' }); // return added
    }
}
userdetails.getUserById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}   
userdetails.updateUser = async (req, res) => {
    const errors = validationResult(req);       
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const parameters = req.body;
        const user = await User.findById(parameters?.id);
        if (!user) {        
            return res.status(404).json({ message: 'User not found' });
        }       

        if (parameters.username) user.username = parameters.username;
        if (parameters.email) user.email =  parameters.email;  
        if (parameters.roleId) user.roleId =  parameters.roleId;
        if (parameters.firtName) user.firtName =  parameters.firtName;
        if (parameters.lastName) user.lastName =  parameters.lastName;
        await user.save();  

        return res.json({ message: 'User updated', user: { id: user._id, username: user.username, email: user.email, roleId: user.roleId } });
    } catch (err) { 
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }       
}
userdetails.deleteUser = async (req, res) => {
    const errors = validationResult(req);       
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {   
        let parameters = req.body;
        const user = await User.findById(parameters?.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deleteOne({ _id: parameters.id });
        return res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}
module.exports = userdetails;