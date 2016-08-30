var Promise = require('bluebird');
var mongoose = require('mongoose');
var User = require('./user');
var Yelp = require('../yelp');
var _ = require('underscore');


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

exports.getData = function(callback){
  User.find({}).exec(function(err,users){
      callback(users)
  })
}

exports.findShortList = function(callback){
  exports.getData(function(users){
    users.forEach(function(user){
      callback(user);
      })
    })

}

exports.markTrueAndSave = function(callback){
  exports.findShortList(function(user){
    User.getRestaurantsToEmail.call(user,callback)
  })
}



exports.sendEmail = function(user){

  User.markSent.call(user,"Newa")
}
