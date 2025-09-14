// middleware/checkPermission.js
const Role = require('../models/role');
const User = require('../models/user');

// ...existing code...
const checkPermission = (requiredPrivilege) => {
  return async (req, res, next) => {
    try {    
      // `req.user.id` should be set after JWT authentication
      const role = await Role.findById(req.user.roleId);

      if (!role) {                     // <-- use `role`, not `Role`
        return res.status(401).json({ message: 'User not found' });
      }

      const privileges = role.privileges || [];

      if (!privileges.includes(requiredPrivilege)) {
        return res.status(403).json({ message: 'Access denied: insufficient privileges' });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' }); // return to be consistent
    }
  };
};
module.exports = checkPermission;