const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String }, // optional for Google users
  googleId: { type: String, unique: true, sparse: true }, // added for Google OAuth
  email: { type: String, unique: true, sparse: true }, // optional
});

module.exports = mongoose.model('User', UserSchema);
