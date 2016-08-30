var mongoose = require('mongoose');
var Promise = require('bluebird');
var Yelp = require('../yelp');
var util = require('./db-helpers');


var userSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  location: { type: String, required: true },
  radius: { type: Number, required:true },
  restaurants: {}
});

var User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next){
  var context = this;
  Yelp.search({term:'hot and new',
              location: this.location, 
              radius_filter: this.radius
  })
    .then(function(data){
      data.businesses.forEach(function(business){
        context.restaurants[business.name] = false;
      })
      next();
     })
    .catch(function(err){
      console.error('Your error is: ', err);
    })
})


module.exports = User;
