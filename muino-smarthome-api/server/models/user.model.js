const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: String,
  fullname: String,
  lastname: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  hashedPassword: {
    type: String,
    required: true
  },
  nSalt: {
    type: String,
    required: true
  },
  phonenumber: String,
  acitvity_status: String,
  avatar_path: String,
  company_Path: String,
  company: String,
  location: String,
  hour_rate: Number,
  telegram: {
    bot_id: String,
    api_token: String,
    chat_id: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  roles: [String],

},
  {
    versionKey: false
  });

// hier wordt initialisatie gemaakt van het schema
module.exports = mongoose.model('User', UserSchema);
