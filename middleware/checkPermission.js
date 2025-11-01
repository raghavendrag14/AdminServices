// middleware/checkPermission.js
const Role = require('../models/role');
const Privilege = require('../models/privilege');

/**
 * checkPermission(requiredPrivilegeCode)
 * - requiredPrivilegeCode: string, e.g. 'READ' or 'WRITE'
 *
 * Middleware expects `req.user` to be set by auth (JWT) middleware. It will
 * attempt to read `roleId` from `req.user.roleId` or `req.user.role`.
 * It then loads the Role and its referenced Privileges and checks whether any
 * privilege's `code` matches the requiredPrivilegeCode. A privilege with code
 * 'ALL' is treated as a wildcard and grants access.
 */
const checkPermission = (requiredPrivilegeCode) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized: missing user' });

      // Support different JWT payload shapes: roleId or role
      const roleId = req.user.roleId || req.user.role || req.user.roleId;
      if (!roleId) return res.status(401).json({ message: 'Unauthorized: missing role information' });

      // Populate privileges to get their `code` fields
      const role = await Role.findById(roleId).populate('privileges');
      if (!role) return res.status(401).json({ message: 'Role not found' });

      const privileges = Array.isArray(role.privileges) ? role.privileges : [];

      // If privileges are stored as ObjectIds and not populated, resolve them
      // by querying Privilege collection (defensive fallback)
      let privilegeCodes = [];
      if (privileges.length && typeof privileges[0] === 'object' && privileges[0].code) {
        privilegeCodes = privileges.map(p => (p.code || '').toUpperCase());
      } else if (privileges.length) {
        const docs = await Privilege.find({ _id: { $in: privileges } });
        privilegeCodes = docs.map(d => (d.code || '').toUpperCase());
      }

      const required = (requiredPrivilegeCode || '').toUpperCase();

      // Grant if user has 'ALL' or the required code
      if (privilegeCodes.includes('ALL') || (required && privilegeCodes.includes(required))) {
        return next();
      }

      return res.status(403).json({ message: 'Access denied: insufficient privileges' });
    } catch (err) {
      console.error('checkPermission error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = checkPermission;