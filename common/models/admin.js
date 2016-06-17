// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var config = require('../../server/config.json');
var path = require('path');
var fs = require('fs');
var jade = require('jade');

module.exports = function(Admin) {
  //send verification email after registration
  Admin.afterRemote('create', function(context, user, next) {
    console.log('> Admin.afterRemote triggered');

    var options = {
      type: 'email',
      to: user.email,
      from: 'noreply@loopback.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/login/verify.jade'),
      redirect: '/verified',
      user: user
    };

    user.verifyRegistration(options, function(err, response) {
      if (err) return next(err);

      console.log('> verification email sent:', response);

      context.res.render('login/response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  //send password reset link when requested
  Admin.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
        info.accessToken.id + '">here</a> to reset your password';

    Admin.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

  // --------------------------Verification Prototype---------------------------------
  Admin.prototype.verifyRegistration = function(options, fn) {
    fn = fn || utils.createPromiseCallback();

    var user = this;
    var userModel = this.constructor;
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
      '?uid=' +
      options.user.id +
      '&redirect=' +
      options.redirect;

    // Email model
    var Email = options.mailer || this.constructor.email || registry.getModelByType(loopback.Email);

    // Set a default token generation function if one is not provided
    var tokenGenerator = options.generateVerificationToken || Admin.generateVerificationToken;

    tokenGenerator(user, function(err, token) {
      if (err) { return fn(err); }

      user.verificationToken = token;
      user.save(function(err) {
        if (err) {
          fn(err);
        } else {
          sendEmail(user);
        }
      });
    });

    // compile jade file
    function compileJade(file) {
      var templates = this._templates || (this._templates = {});
      var str = templates[file] || (templates[file] = fs.readFileSync(file, 'utf8'));
      return jade.compile(str, {
        filename: file
      });
    };

    function sendEmail(user) {
      options.verifyHref += '&token=' + user.verificationToken;

      options.text = options.text || 'Please verify your email by opening this link in a web browser:\n\t{href}';

      options.text = options.text.replace(/\{href\}/g, options.verifyHref);

      options.to = options.to || user.email;

      options.subject = options.subject || 'Thanks for Registering';

      options.headers = options.headers || {};

      var template = compileJade(options.template);
      options.html = template(options);

      Email.send(options, function(err, email) {
        if (err) {
          fn(err);
        } else {
          fn(null, {email: email, token: user.verificationToken, uid: user.id});
        }
      });
    }
    return fn.promise;
  };
  //----------------------------------------------------------------------------------
};
