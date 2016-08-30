var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var User = require('./user');
var Yelp = require('../yelp');
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

exports.getData = function(callback){
  User.find({}).exec(function(err,users){
      callback(users)
  })
}

exports.findShortList = function(callback){
  exports.getData(function(users){
    users.forEach(function(user){
      //console.log(user,"this is a user")
      callback(user);

      })
    })

}

exports.markTrueAndSave = function(callback){
  exports.findShortList(function(user){
    var email = user.email

    User.findOne({email: email}).then(function(results){
      console.log(results.restaurants, typeof results.restaurants, "this user")
      results.restaurants.forEach(function(rest){
        console.log(rest,"eachrest")
        if (rest){
          rest = true
        }
        user.markModified('restaurants');
        user.save();
      })


    })
    // for (var restaurant in biz){
    //   //console.log(restaurant, "does it reach marktrueandsave?")
    //   if (!biz[restaurant]){
    //   //   User.update({email:user.email}, { $set: {restaurants : { `${restaurant}`: true}} } , function(data){
    //   //     console.log(biz,data,"check if this step is working")
    //   //     callback(biz)
    //   //   })
    //     console.log(restaurant, typeof restaurant,"testt"); 
    //     User.findOne({email: email}).then(function(user){
    //       user.restaurants[restaurant] = true;
    //       user.markModified('restaurants');
    //       user.save(function(err,res){
    //         if (err){console.log(err,"ERROR")}
    //           else {
    //             console.log('success')
    //             callback(user)
    //           }
    //       })
    //     })

  
    //   }
    // }
  })
}



exports.sendEmail = function(){
  exports.markTrueAndSave(function(email,res){
    console.log(email,res,"will this console log correctly?");
  })
}
