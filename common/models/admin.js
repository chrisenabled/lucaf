// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var config = require('../../server/config.json');
var path = require('path');
var fs = require('fs');
var jade = require('jade');
var sendMail = require('../../server/utils/sendMail');

module.exports = function(Admin) {

  // before remote hooks
  Admin.beforeRemote('create', function(context, user, next) {
    context.args.data.created = Date.now();
    next();
  });


  // after remote hooks
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

    //send verification email after registration
    sendMail.verifyRegistration(options, function(err, response) {
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
};
