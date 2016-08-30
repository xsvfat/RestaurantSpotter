var mongoose = require('mongoose');
var Promise = require('bluebird');
var Yelp = require('../yelp');
var _ = require('underscore')
var Emailer = require('../sendgrid')
//var util = require('./db-helpers');


var userSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  location: { type: String, required: true },
  radius: { type: Number, required:true },
  restaurants: {}
});

var User = mongoose.model('User', userSchema);

User.getRestaurantsToEmail = function(cb){
  var results = [];
  var email = this.email;
  for (var k in this.restaurants){
    if (!this.restaurants[k]){
      results.push(k);
    }
  }
  console.log(results)
  cb(email,results)
}


User.markSent = function(restaurant,cb){
  this.restaurants[restaurant] = true;
  this.markModified('restaurants');
  this.save(function(err, user,n) {
    if (err) { 
      console.log('errr',err)
    } else {
      cb(user)
    }
  })
}

userSchema.pre('save', function(next){
  if (_.isEmpty(this.restaurants) === false){
    //only run this function on creation
    next();
  } else {
  var context = this;
  Yelp.search({term:'hot and new',
              location: this.location, 
              radius_filter: this.radius
  })
    .then(function(data){
      // var nameList = [];
      data.businesses.forEach(function(business){
        context.restaurants[business.name] =  false;
        // nameList.push(business.name);
      })
      //send an email on user creation
      // Emailer.send(context.email, nameList);
      next();
     })
    .catch(function(err){
      console.error('Your error is: ', err);
    })
  } 
})


module.exports = User;