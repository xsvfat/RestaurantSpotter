var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = require('./user');
var Yelp = require('../yelp')
var _ = require('underscore');

exports.find = function(){
  // Yelp.search({term:'hot and new',
  //             location: this.location, 
  //             radius_filter: this.radius
  // })
}

exports.addNew = function(){
  User.find({}).exec(function(err, users){
    users.forEach(function(user){
      Yelp.search({term:'hot and new',
                  location: user.location, 
                  radius_filter: user.radius
      })
      .then(function(data){
        data.businesses.forEach(function(business){
          if (user.restaurants[business]){
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

exports.filterNewRestaurants = function(callback){
  var results = [];
  User.find({}).exec(function(err,users){
    users.forEach(function(user){
      for (var biz in user.restaurants){
        if (!biz){
          results.push(biz)
          biz = true;
          console.log(biz, "Does it reach here? Callback on biz?")
          // callback(biz);
        }
      }
    })
  }).then(function(){
    callback(results)
  })
  .catch(function(err){
    console.error('Your error is: ', err);
  })
}

