const mongoose = require('mongoose');
// Hash passwords securely with bcrypt
const bcrypt = require('bcryptjs'); 

// Defines schema structure: user document
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, 
{ 
  timestamps: true 
}); // Add createdAt and updatedAt fields

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Add Random data to hash password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create a model named User based on the UserSchema
// Interact with mongodb users collections
const User = mongoose.model('User', UserSchema);

module.exports = User; 
