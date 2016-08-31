var util = require('./app/db-helpers');
console.log("Cron Job Ran")
util.checkForNewRestaurants();
util.sendEmails();