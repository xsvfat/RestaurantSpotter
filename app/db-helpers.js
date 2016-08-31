var Promise = require('bluebird');
//var mongoose = require('mongoose');
var db = require('./config');
Promise.promisifyAll(require("mongoose"));
var User = require('./user');
var Yelp = require('../yelp');
var _ = require('underscore');
var Emailer = require('../sendgrid')


exports.checkForNewRestaurants = function(){
  User.find({}).exec(function(err, users){
    users.forEach(function(user){
      Yelp.search({term:'hot and new',
                  location: user.location, 
                  radius_filter: user.radius
      })
      .then(function(data){
        data.businesses.forEach(function(business){
          if (user.restaurants[business] === undefined){
            user.restaurants[business] = false;
          }
        })
      })
      .catch(function(err){
        console.error('Your error is: ', err);
      })
      user.save(function(err,updated) {
        if(err) {
          console.error('ERROR!', err);
         }
         console.log("Succesfully updated", updated)
      })
    })
  });
}

var getData = function(callback){
  console.log("1",callback)
  console.log(User.find({}),"test")
  User.find({}).exec(function(err,users){
     if (err){
      console.log("error is" , err)
     } else {
       callback(users);
     }
  })
}

var findShortList = function(callback){
  getData(function(users){
    users.forEach(function(user){
      callback(user);
      })
    })

}

var sendEmail = function(callback){
  findShortList(function(user){
    User.getRestaurantsToEmail.call(user,callback)
  })
}

exports.sendEmails = function(){
  sendEmail(function(email,resultsArray){
    Emailer.send(email,resultsArray);
  })
}

exports.markSent = function(email,restaurantArray){
  User.findOne({email:email}).exec(function(err,user){
    restaurantArray.forEach(function(restaurant){
      user.restaurants[restaurant] = true;
    })
      user.markModified('restaurants')
      user.save(function(err, user,n) {
      if (err) { 
        console.log('errr',err)
      } else {
        //cb(user)
        console.log('success')
      }
    })
  })
}
