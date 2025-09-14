const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.middleware");
const { validationResult } = require("express-validator");
const User = require("../models/user");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), roleId: user.roleId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "1d" }
  );
}
auth.authentication = (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Missing token" });

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // { id, role }
      
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid/expired token" });
    }
  };
auth.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
    try {
      const parameters = req.body;
      parameters.username = removeAtStart(parameters.username)
      const user = await User.findOne({ username: parameters.username }).select("+password");
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
      const ok = await user.comparePassword(parameters.password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  
      const token = signToken(user);
      res.json({ token, user: { id: user._id, username: user.username, roleId: user.roleId } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  function removeAtStart(str) {
  if (typeof str === 'string' && str.startsWith('@')) {
    return str.slice(1);
  }
  return str;
}
  auth.refreshToken = (req, res) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Missing token" });
  
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const newToken = signToken({ _id: payload.id, role: payload.role });
      res.json({ token: newToken });
    } catch (err) {
      return res.status(401).json({ message: "Invalid/expired token" });
    }
  };
module.exports = auth;