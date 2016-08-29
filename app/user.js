var mongoose = require('mongoose');
//var Promise = require('bluebird');

var userSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  location: { type: String, required: true },
  restaurants: {
    name: String, 
    status: Boolean
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
