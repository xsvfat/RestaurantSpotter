var express = require('express');
var db = require('./app/config');
var app = express();
var request = require('request');
var User = require('./app/user');
var Yelp = require('./yelp')
var bodyParser = require('body-parser');
var Promise = require('bluebird');
//var util = require('./app/db-helpers');
var Emailer = require('./sendgrid')

var conv = {
  '1 mile': 1600,
  '3 miles': 4850,
  '5 miles': 8050,
  '10 miles': 16500
}
 //app.set('views', __dirname + '/views');

// app.set('view engine', 'ejs');
// app.use(partials());
// // Parse JSON (uniform resource locators)
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

app.post('/signup', function(req, res) {
  var location = req.body.location;
  var email = req.body.email;
  var radius = req.body.radius
  console.log(req.body, 'this is req.body')
  User.findOne({ email: email })
    .exec(function(err, user) {
      if (!user) {
        var newUser = new User({
          email: email,
          location: location,
          radius: conv[radius],
          restaurants: {}
        });
      newUser.save(function(err, newUser) {
        if (err) {
          res.status(500).send(err);
        }
 
        });
      } else {
        //Insert a warning if unable to save
      }
    });
});


var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);
