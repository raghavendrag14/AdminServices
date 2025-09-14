const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// models/User.js
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,   
      trim: true,
      lowercase: true 
    },
    firtName: {
      type: String, 
      trim: true
    },
    lastName: {
      type: String, 
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',   // Reference to Role collection
      required: true
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);


// Hash password before save if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
