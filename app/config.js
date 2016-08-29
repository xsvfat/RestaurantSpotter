var mongoose = require('mongoose');

// mongoURI = 'mongodb://localhost/shortlydb';
mongoose.connect('localhost:27017');

// Run in seperate terminal window using 'mongod'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongodb connection open');
});

module.exports = db;
