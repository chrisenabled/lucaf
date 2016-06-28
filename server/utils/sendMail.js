/**
 * Created by chrisenabled on 6/27/16.
 */

var path = require('path');
var fs = require('fs');
var jade = require('jade');
var loopback = require('loopback');


// compile jade file
function compileJade(file) {
  var templates = this._templates || (this._templates = {});
  var str = templates[file] || (templates[file] = fs.readFileSync(file, 'utf8'));
  return jade.compile(str, {
    filename: file
  });
}
// send email
function sendEmail(Email, options, fn) {

  options.to = options.to || options.user.email;

  options.subject = options.subject || 'From Lift Up Care Foundation';

  options.headers = options.headers || {};

  var template = compileJade(options.template);
  options.html = template(options);

  Email.send(options, function(err, email) {
    if (err) {
      fn(err);
    } else {
      fn(null, {email: email});
    }
  });
}

module.exports =  {


  // send email to user to verify account registration
  verifyRegistration :  function(options, fn) {
    fn = fn || utils.createPromiseCallback();

    var user = options.user;
    var userModel = user.constructor;
    var registry = userModel.registry;

    options.redirect = options.redirect || '/';
    options.template = path.resolve(options.template);
    options.user = this;
    options.protocol = options.protocol || 'http';

    var app = userModel.app;
    options.host = options.host || (app && app.get('host')) || 'localhost';
    options.port = options.port || (app && app.get('port')) || 3000;
    options.restApiRoot = options.restApiRoot || (app && app.get('restApiRoot')) || '/api';

    var displayPort = (
      (options.protocol === 'http' && options.port == '80') ||
      (options.protocol === 'https' && options.port == '443')
    ) ? '' : ':' + options.port;

    options.verifyHref = options.verifyHref ||
      options.protocol +
      '://' +
      options.host +
      displayPort +
      options.restApiRoot +
      userModel.http.path +
      userModel.sharedClass.find('confirm', true).http.path +
      '?uid=' + user.id +
      '&redirect=' +
      options.redirect;

    options.text = options.text || 'Please verify your email by opening this link in a web browser:\n\t{href}';

    var Email = options.mailer || this.constructor.email || registry.getModelByType(loopback.Email);


    // Set a default token generation function if one is not provided
    var tokenGenerator = options.generateVerificationToken || app.models.Admin.generateVerificationToken;

    tokenGenerator(user, function(err, token) {
      if (err) { return fn(err); }

      options.verifyHref += '&token=' + token;
      options.text = options.text.replace(/\{href\}/g, options.verifyHref);

      user.verificationToken = token;
      user.save(function(err) {
        if (err) {
          fn(err);
        } else {
          sendEmail(Email, options, fn);
        }
      });
    });
    return fn.promise;
  }


};
