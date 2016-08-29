var express = require('express');
//var db = require('./app/config');
var app = express();

 //app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
// app.use(partials());
// // Parse JSON (uniform resource locators)
// app.use(bodyParser.json());
// // Parse forms (signup/login)
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

app.post('/signup', function(req, res) {
  var location = req.body.location;
  var email = req.body.email;

  User.findOne({ email: email })
    .exec(function(err, user) {
      if (!user) {
        var newUser = new User({
          email: email,
          location: location
        });
        newUser.save(function(err, newUser) {
          if (err) {
            res.status(500).send(err);
          }
          util.createSession(req, res, newUser);
        });
      } else {
        console.log('Account already exists');
        //res.redirect('/signup');
        //need to add code to show an error message saying email already entered
      }
    });
});


var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);
