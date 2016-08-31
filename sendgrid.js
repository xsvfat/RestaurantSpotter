// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
var helper = require('sendgrid').mail  
var from_email = new helper.Email("xsvfat@gmail.com")
var subject = "You've got a new restaurant alert!"
var SENDGRID_API_KEY = "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";
var sg = require('sendgrid')(SENDGRID_API_KEY);
var User = require('./app/user');
var util = require('./app/db-helpers');


exports.send = function(toEmail,contentArray){
  console.log("5",toEmail)
  var cont = contentArray.reduce(function(total,item){
    total += (" \n " + item);
    return total;
  },"Your New Restaurants are: '\n' ")
  console.log(cont,"this is the emails contents")
  var to_email = new helper.Email(toEmail)
  var content = new helper.Content("text/plain",cont)
  var mail = new helper.Mail(from_email, subject, to_email, content)

  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
  console.log('does this line get triggered?', request)
  sg.API(request, function(error, response) {
    console.log(response.statusCode, "Does this get run?")
    console.log(response.body)
    console.log(response.headers)
    if (response.statusCode === 202 ){
      util.markSent(toEmail,contentArray)
    }
  })

}