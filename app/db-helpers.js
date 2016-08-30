var Promise = require('bluebird');
var mongoose = require('mongoose');
var User = require('./user');
var Yelp = require('../yelp');
var _ = require('underscore');


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
    User.checkNewRestaurants.call(user,callback)
  })
}



exports.sendEmail = function(user){
  // exports.markTrueAndSave(function(email,res){
  //   console.log(email,res,"will this console log correctly?");
  // })
  console.log(user, 'what is this here?')
  //user.restaurants['Newa'] = true;
  User.markSent.call(user,"Newa")
}
