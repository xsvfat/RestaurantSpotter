var Promise = require('bluebird');
var db = require('./config');
var mongoose = require('mongoose');
var Yelp = require('../yelp');
var _ = require('underscore')
var Emailer = require('../sendgrid')

var userSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  location: { type: String, required: true },
  radius: { type: Number, required:true },
  restaurants: {}
});

var User = mongoose.model('User', userSchema);

User.getRestaurantsToEmail = function(cb){
  console.log("test?",cb)
  var results = [];
  var email = this.email;
  for (var k in this.restaurants){
    if (!this.restaurants[k]){
      results.push(k);
    }
  }
  console.log(results,"this results")
  if (results.length > 0){
      cb(email,results)
  }
}

userSchema.pre('save', function(next){
  if (_.isEmpty(this.restaurants) === false){
    next();
  } else {
  var context = this;
  Yelp.search({term:'hot and new',
              location: this.location, 
              radius_filter: this.radius
  })
    .then(function(data){
      data.businesses.forEach(function(business){
        context.restaurants[business.name] =  false;
      })
      next();
     })
    .catch(function(err){
      console.error('Your error is: ', err);
    })
  } 
})


module.exports = User;