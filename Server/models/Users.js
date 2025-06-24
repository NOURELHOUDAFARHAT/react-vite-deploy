const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  avatar : String,
}, 

{ collection: 'users' }
); 

UserSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }
  this.password = await bcrypt.hash(this.password, 10);
})

// Create the User model based on the user schema
const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
