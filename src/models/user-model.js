const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
   email: String,
   password: String,
   createdAt: { type: Date, default : Date.now() }
});

module.exports = mongoose.model('User', UserSchema, 'users');
